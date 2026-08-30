import { spawn, type ChildProcess } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { AdapterTesterConfig } from "./config.js";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";
import { launchAndDetectStorybook, toLaunchTarget } from "./portDiscovery.js";

/**
 * Interactive Dev Mode: a synced, side-by-side browser view of this
 * project's own Storybook and the source of truth, with per-story note
 * taking and an AI-report export. Boots both Storybooks (reusing them if
 * already running) behind a proxy so the own/target pane — which drives
 * the sync and carries Storybook's nav sidebar — loads same-origin on the
 * left, with the source of truth following along as a bare preview on the
 * right.
 *
 * Config-driven — takes the same `{ engineConfig, webServers }` shape
 * `resolveConfig()` produces, in the same [sourceOfTruth, target] order.
 */

const distDir = dirname(fileURLToPath(import.meta.url));

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

export async function startDevServer(
  engineConfig: AdapterTesterConfig,
  webServers: HarnessWebServerConfig[],
  options: DevServerOptions = {},
): Promise<void> {
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

  // Neither Storybook is pinned to a specific port — each one silently
  // falls back to an OS-assigned port whenever its default/configured one is
  // taken, so the real port is only known once it reports it (see
  // portDiscovery.ts). Booted concurrently since neither depends on the other.
  console.log(
    `[Dev Launcher] Resolving ${sourceOfTruth.name} and ${target.name} Storybooks...`,
  );
  const [sourceOfTruthRunning, targetRunning] = await Promise.all([
    launchAndDetectStorybook(
      toLaunchTarget(sourceOfTruth.name, sourceOfTruthServer),
    ),
    launchAndDetectStorybook(toLaunchTarget(target.name, targetServer)),
  ]);
  console.log(`[Dev Launcher] Both Storybooks are active and responsive!`);

  const spawned = [sourceOfTruthRunning.process, targetRunning.process].filter(
    (child): child is ChildProcess => child !== null,
  );

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
        ownName: target.name,
        sourceOfTruthName: sourceOfTruth.name,
        sourceOfTruthPort: sourceOfTruthRunning.port,
      })};</script>`,
    );
    res.send(html);
  });

  // Serve the AI prompt header dynamically so it can be edited externally.
  // `reportHeader` in adapter-tester.config.json overrides the file entirely.
  app.get("/report-header.txt", (req, res) => {
    if (engineConfig.reportHeader !== undefined) {
      res.type("text/plain").send(engineConfig.reportHeader);
      return;
    }
    try {
      res.type("text/plain").send(readFileSync(headerPath, "utf8"));
    } catch {
      res.status(500).send("Error loading report-header.txt");
    }
  });

  // Proxy everything else to this project's own Storybook, preserving
  // absolute paths (e.g. /@vite/client) so HMR keeps working same-origin.
  // This is the pane that drives the sync and shows Storybook's nav sidebar.
  app.use(
    "/",
    createProxyMiddleware({
      target: targetRunning.url,
      changeOrigin: true,
      ws: true,
    }),
  );

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

  app.listen(devPort, () => {
    console.log(`
====================================================
🚀 Adapter Dev Mode proxy running at:
   http://localhost:${devPort}
====================================================
`);
    openBrowser(`http://localhost:${devPort}`);
  });
}
