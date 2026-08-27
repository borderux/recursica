import { spawn, type ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import net from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { AdapterTesterConfig } from "./config.js";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";

/**
 * Interactive Dev Mode: a synced, side-by-side browser view of the source of
 * truth and this project's own Storybook, with per-story note taking and an
 * AI-report export. Boots both Storybooks (reusing them if already running)
 * behind a proxy so the source-of-truth pane loads same-origin.
 *
 * Config-driven — takes the same `{ engineConfig, webServers }` shape
 * `resolveConfig()` produces, in the same [sourceOfTruth, target] order.
 */

const distDir = dirname(fileURLToPath(import.meta.url));

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

async function waitForPort(port: number, timeoutMs = 60000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortActive(port)) return true;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

function portOf(url: string): number {
  return Number(new URL(url).port);
}

function launchStorybook(
  name: string,
  server: HarnessWebServerConfig,
): ChildProcess {
  console.log(
    `[Dev Launcher] Port ${server.port} is inactive. Launching Storybook for ${name}...`,
  );
  const child = spawn(server.command, {
    cwd: server.cwd,
    stdio: "pipe",
    shell: true,
  });

  child.stdout?.on("data", (data: Buffer) => {
    for (const line of data.toString().split("\n")) {
      if (line.trim()) console.log(`[${name} SB] ${line.trim()}`);
    }
  });
  child.stderr?.on("data", (data: Buffer) => {
    for (const line of data.toString().split("\n")) {
      if (line.trim()) console.error(`[${name} SB ERROR] ${line.trim()}`);
    }
  });
  child.on("error", (err) => {
    console.error(`[${name} SB ERROR] Failed to start process:`, err);
  });

  return child;
}

function openBrowser(url: string): void {
  const startCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  console.log(`[Dev Launcher] Auto-launching browser: ${url}`);
  spawn(startCmd, [url], { shell: process.platform === "win32" }).on(
    "error",
    (err) => {
      console.error(`[Dev Launcher] Failed to auto-launch browser:`, err);
    },
  );
}

export interface DevServerOptions {
  /** Port the dev-mode proxy UI itself listens on. Defaults to 6010. */
  port?: number;
}

export function startDevServer(
  engineConfig: AdapterTesterConfig,
  webServers: HarnessWebServerConfig[],
  options: DevServerOptions = {},
): void {
  const [sourceOfTruth, target] = engineConfig.targets;
  const [sourceOfTruthServer, targetServer] = webServers;
  if (
    !sourceOfTruth?.sourceOfTruth ||
    !target ||
    target.sourceOfTruth ||
    !sourceOfTruthServer ||
    !targetServer
  ) {
    throw new Error(
      "adapter-tester dev mode requires exactly two targets: [sourceOfTruth, target] — check adapter-tester.config.json.",
    );
  }

  const devPort = options.port ?? 6010;
  const sourceOfTruthPort = portOf(sourceOfTruth.url);
  const targetPort = portOf(target.url);

  const app = express();
  const publicDir = join(distDir, "../public");
  const headerPath = join(distDir, "../report-header.txt");

  // Serve the Dev Mode UI at the root path ONLY if there is no query string.
  // This allows the iframe (which loads with ?path=/story/...) to pass
  // through to the proxy, avoiding an infinite loop of nested wrappers.
  app.get("/", (req, res, next) => {
    if (req.query.path) {
      next();
      return;
    }
    const html = readFileSync(join(publicDir, "index.html"), "utf8").replace(
      "<head>",
      `<head>\n  <script>window.__ADAPTER_TESTER__ = ${JSON.stringify({
        sourceOfTruthName: sourceOfTruth.name,
        targetName: target.name,
        targetPort,
      })};</script>`,
    );
    res.send(html);
  });

  // Serve the AI prompt header dynamically so it can be edited externally.
  app.get("/report-header.txt", (req, res) => {
    try {
      res.type("text/plain").send(readFileSync(headerPath, "utf8"));
    } catch {
      res.status(500).send("Error loading report-header.txt");
    }
  });

  // Proxy everything else to the source of truth's Storybook, preserving
  // absolute paths (e.g. /@vite/client) so HMR keeps working same-origin.
  app.use(
    "/",
    createProxyMiddleware({
      target: `http://localhost:${sourceOfTruthPort}`,
      changeOrigin: true,
      ws: true,
    }),
  );

  const spawned: ChildProcess[] = [];
  let cleaningUp = false;
  const cleanup = () => {
    if (cleaningUp) return;
    cleaningUp = true;
    console.log(
      "\n[Dev Launcher] Shutting down Dev Mode server and spawned Storybooks...",
    );
    for (const child of spawned) child.kill("SIGINT");
    process.exit(0);
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  app.listen(devPort, async () => {
    console.log(`
====================================================
🚀 Adapter Dev Mode proxy running at:
   http://localhost:${devPort}
====================================================
`);

    const [sourceOfTruthRunning, targetRunning] = await Promise.all([
      isPortActive(sourceOfTruthPort),
      isPortActive(targetPort),
    ]);

    if (sourceOfTruthRunning) {
      console.log(
        `[Dev Launcher] ${sourceOfTruth.name} is already running on port ${sourceOfTruthPort}.`,
      );
    } else {
      spawned.push(launchStorybook(sourceOfTruth.name, sourceOfTruthServer));
    }
    if (targetRunning) {
      console.log(
        `[Dev Launcher] ${target.name} is already running on port ${targetPort}.`,
      );
    } else {
      spawned.push(launchStorybook(target.name, targetServer));
    }

    const waits: Promise<boolean>[] = [];
    if (!sourceOfTruthRunning) waits.push(waitForPort(sourceOfTruthPort));
    if (!targetRunning) waits.push(waitForPort(targetPort));

    if (waits.length > 0) {
      console.log(`[Dev Launcher] Waiting for Storybooks to be responsive...`);
      const results = await Promise.all(waits);
      if (results.every(Boolean)) {
        console.log(`[Dev Launcher] All Storybooks are active and responsive!`);
      } else {
        console.warn(
          `[Dev Launcher] Warning: some Storybooks timed out during startup, but proceeding...`,
        );
      }
    } else {
      console.log(`[Dev Launcher] Both Storybooks already active.`);
    }

    openBrowser(`http://localhost:${devPort}`);
  });
}
