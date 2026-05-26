import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import net from "net";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mantineDir = join(__dirname, "../../mantine-adapter");
const muiDir = join(__dirname, "../../mui-adapter");

const app = express();
const PORT = process.env.PORT || 6010;
const publicPath = join(__dirname, "../public/index.html");

// Serve the Dev Mode UI at the root path ONLY if there is no query string.
// This allows the iframe (which loads with ?path=/story/...) to pass through to the proxy,
// avoiding an infinite loop of nested Dev Mode wrappers.
app.get("/", (req, res, next) => {
  if (!req.query.path) {
    try {
      const html = readFileSync(publicPath, "utf8");
      return res.send(html);
    } catch (err) {
      return res.status(500).send("Error loading index.html");
    }
  }
  next();
});

// Serve the AI Prompt header dynamically so it can be edited externally
const headerPath = join(__dirname, "../report-header.txt");
app.get("/report-header.txt", (req, res) => {
  try {
    const text = readFileSync(headerPath, "utf8");
    res.type("text/plain").send(text);
  } catch (err) {
    res.status(500).send("Error loading report-header.txt");
  }
});

// Proxy everything else to Mantine Storybook (Port 6011)
// This preserves absolute paths for Vite (e.g. /@vite/client)
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:6011",
    changeOrigin: true,
    ws: true, // proxy websockets for HMR
  }),
);

// Helper: Check if a port is responsive
function isPortActive(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(200);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, "127.0.0.1");
  });
}

// Helper: Wait for port to become active with polling
async function waitForPort(port: number, timeoutMs = 60000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortActive(port)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

const spawnedProcesses: any[] = [];

// Helper: Launch Storybook process in background
function launchStorybook(name: string, dir: string, port: number) {
  const isWindows = process.platform === "win32";
  const npmCmd = isWindows ? "npm.cmd" : "npm";

  console.log(
    `[Dev Launcher] Port ${port} is inactive. Launching Storybook for ${name}...`,
  );
  const child = spawn(npmCmd, ["run", "storybook"], {
    cwd: dir,
    stdio: "pipe",
  });

  child.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) console.log(`[${name} SB] ${line.trim()}`);
    }
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) console.error(`[${name} SB ERROR] ${line.trim()}`);
    }
  });

  child.on("error", (err) => {
    console.error(`[${name} SB ERROR] Failed to start process:`, err);
  });

  spawnedProcesses.push(child);
  return child;
}

// Helper: Open default web browser cross-platform
function openBrowser(url: string) {
  const startCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";

  console.log(`[Dev Launcher] Auto-launching browser: ${url}`);
  const useShell = process.platform === "win32";
  spawn(startCmd, [url], { shell: useShell }).on("error", (err) => {
    console.error(`[Dev Launcher] Failed to auto-launch browser:`, err);
  });
}

// Cleanup hook for spawned child processes
let isCleaningUp = false;
const cleanup = () => {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log(
    "\n[Dev Launcher] Shutting down Dev Mode server and spawned Storybooks...",
  );
  for (const child of spawnedProcesses) {
    try {
      child.kill("SIGINT");
    } catch (e) {
      // ignore
    }
  }
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

app.listen(PORT, async () => {
  console.log(`
====================================================
🚀 Adapter Dev Mode proxy running at:
   http://localhost:${PORT}
====================================================
`);

  try {
    const mantineRunning = await isPortActive(6011);
    const muiRunning = await isPortActive(6012);

    if (mantineRunning) {
      console.log(
        `[Dev Launcher] Mantine Storybook is already running on port 6011.`,
      );
    } else {
      launchStorybook("Mantine", mantineDir, 6011);
    }

    if (muiRunning) {
      console.log(
        `[Dev Launcher] MUI Storybook is already running on port 6012.`,
      );
    } else {
      launchStorybook("MUI", muiDir, 6012);
    }

    // Wait for whatever wasn't running to become active, then launch browser
    if (!mantineRunning || !muiRunning) {
      console.log(`[Dev Launcher] Waiting for Storybooks to be responsive...`);
      const waitPromises: Promise<boolean>[] = [];
      if (!mantineRunning) waitPromises.push(waitForPort(6011));
      if (!muiRunning) waitPromises.push(waitForPort(6012));

      const results = await Promise.all(waitPromises);
      if (results.every(Boolean)) {
        console.log(`[Dev Launcher] All Storybooks are active and responsive!`);
      } else {
        console.warn(
          `[Dev Launcher] Warning: Some Storybooks timed out during startup, but proceeding...`,
        );
      }
    } else {
      console.log(`[Dev Launcher] Both Storybooks already active.`);
    }

    openBrowser(`http://localhost:${PORT}`);
  } catch (err) {
    console.error(`[Dev Launcher] Error initializing Dev Mode:`, err);
  }
});
