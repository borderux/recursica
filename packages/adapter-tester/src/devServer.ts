import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "@playwright/test";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { AdapterTesterConfig } from "./config.js";
import { diffPngBuffers } from "./golden/diffPng.js";
import {
  resolveSourceOfTruthGolden,
  type SourceOfTruthGolden,
} from "./golden/resolveSourceOfTruthGolden.js";
import {
  captureStoryScreenshot,
  resolveThreshold,
  resolveViewport,
} from "./testing/runVisualRegression.js";
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

/** Version of `@recursica/adapter-mantine-v8` installed in the harness (or
 * read from a local source-of-truth checkout's own package.json). */
function readInstalledMantineVersion(cwd: string): string {
  const installed = join(
    cwd,
    "node_modules/@recursica/adapter-mantine-v8/package.json",
  );
  const path = existsSync(installed) ? installed : join(cwd, "package.json");
  return JSON.parse(readFileSync(path, "utf8")).version;
}

const DEFAULT_DEV_PORT = 6010;

export interface DevServerOptions {
  /** Port the dev-mode proxy UI itself listens on. Defaults to 6010, stepping to the next free port if taken. */
  port?: number;
  /** Absolute path of `adapter-tester.config.json`, where per-story
   * threshold overrides are saved. */
  configPath: string;
}

/** Everything the Dev Mode diff UI needs about one story's divergence. */
interface GoldenDiffResult {
  status: "ok" | "no-golden" | "size-mismatch";
  /** `null` unless `status` is `"ok"`. */
  diffPixels: number | null;
  threshold: number;
  viewport: { width: number; height: number };
  /** PNG data URLs. `golden` is `null` for `"no-golden"`; `diff` is `null`
   * unless `status` is `"ok"`. */
  golden: string | null;
  diff: string | null;
}

const toDataUrl = (png: Buffer) =>
  `data:image/png;base64,${png.toString("base64")}`;

/** Registers the Dev Mode `/__golden/*` routes: capture this project's live
 * story at its configured viewport, diff it against the source-of-truth
 * golden exactly as the divergence check does, and persist threshold edits. */
function registerGoldenRoutes(
  app: express.Express,
  engineConfig: AdapterTesterConfig,
  targetUrl: string,
  golden: SourceOfTruthGolden | Error,
  configPath: string,
): { close: () => Promise<void> } {
  let browser: Promise<Browser> | undefined;
  // Captures run one at a time — each is a full page load, and a flurry from
  // rapid story switching shouldn't pile up headless pages.
  let queue: Promise<unknown> = Promise.resolve();

  const thresholdFor = (id: string) =>
    resolveThreshold(
      id,
      Object.fromEntries(
        Object.entries(engineConfig.stories ?? {})
          .filter(([, o]) => o.sourceOfTruthThreshold !== undefined)
          .map(([key, o]) => [key, o.sourceOfTruthThreshold!]),
      ),
      engineConfig.sourceOfTruthThresholdPixels,
    );

  const computeDiff = async (id: string): Promise<GoldenDiffResult> => {
    browser ??= chromium.launch();
    const page = await (await browser).newPage();
    const viewport = resolveViewport(id, engineConfig.stories ?? {});
    try {
      await page.setViewportSize(viewport);
      await page.goto(`${targetUrl}/iframe.html?id=${id}&viewMode=story`, {
        waitUntil: "networkidle",
      });
      const live = await captureStoryScreenshot(page);
      const goldenImage = await (golden as SourceOfTruthGolden).readImage(id);
      const threshold = thresholdFor(id);
      if (!goldenImage) {
        return {
          status: "no-golden",
          diffPixels: null,
          threshold,
          viewport,
          golden: null,
          diff: null,
        };
      }
      const { diffPixels, diffImage } = diffPngBuffers(live, goldenImage);
      return {
        status: diffImage ? "ok" : "size-mismatch",
        diffPixels: diffImage ? diffPixels : null,
        threshold,
        viewport,
        golden: toDataUrl(goldenImage),
        diff: diffImage ? toDataUrl(diffImage) : null,
      };
    } finally {
      await page.close();
    }
  };

  app.get("/__golden/diff", (req, res) => {
    if (golden instanceof Error) {
      res.status(503).json({ error: golden.message });
      return;
    }
    const id = String(req.query.id ?? "");
    if (!id) {
      res.status(400).json({ error: "id is required" });
      return;
    }
    const run = queue.then(() => computeDiff(id));
    queue = run.catch(() => undefined);
    run.then(
      (result) => res.json(result),
      (err: Error) => res.status(500).json({ error: err.message }),
    );
  });

  app.get("/__golden/image", async (req, res) => {
    const image =
      golden instanceof Error
        ? null
        : await golden.readImage(String(req.query.id ?? ""));
    if (!image) {
      res.status(404).end();
      return;
    }
    res.type("image/png").send(image);
  });

  app.post("/__golden/threshold", express.json(), (req, res) => {
    const { id, value } = req.body ?? {};
    if (
      typeof id !== "string" ||
      !id ||
      !Number.isInteger(value) ||
      value < 0
    ) {
      res
        .status(400)
        .json({ error: "id (string) and value (integer >= 0) are required" });
      return;
    }
    const file = existsSync(configPath)
      ? JSON.parse(readFileSync(configPath, "utf8"))
      : {};
    file.stories = {
      ...file.stories,
      [id]: { ...file.stories?.[id], sourceOfTruthThreshold: value },
    };
    writeFileSync(configPath, JSON.stringify(file, null, 2) + "\n");
    engineConfig.stories = {
      ...engineConfig.stories,
      [id]: { ...engineConfig.stories?.[id], sourceOfTruthThreshold: value },
    };
    res.json({ id, value });
  });

  return {
    close: async () => {
      if (browser) await (await browser).close();
    },
  };
}

export async function startDevServer(
  engineConfig: AdapterTesterConfig,
  webServers: HarnessWebServerConfig[],
  options: DevServerOptions,
): Promise<void> {
  const [sourceOfTruth, target] = engineConfig.targets;
  const [sourceOfTruthServer, targetServer] = webServers;
  if (
    !sourceOfTruth?.sourceOfTruth ||
    !target ||
    target.sourceOfTruth ||
    !targetServer ||
    !sourceOfTruthServer
  ) {
    throw new Error(
      "adapter-tester dev mode requires exactly two targets: [sourceOfTruth, target] — check adapter-tester.config.json.",
    );
  }
  if (!engineConfig.sourceOfTruthGolden) {
    throw new Error(
      "adapter-tester dev mode needs a sourceOfTruthGolden location to diff against — check adapter-tester.config.json.",
    );
  }

  // Neither Storybook is pinned to a specific port — each one silently
  // falls back to an OS-assigned port whenever its default/configured one is
  // taken, so the real port is only known once it reports it (see
  // portDiscovery.ts). Booted concurrently since neither depends on the other.
  console.log(
    `[Dev Launcher] Resolving ${sourceOfTruth.name} and ${target.name} Storybooks...`,
  );
  const [sourceOfTruthRunning, targetRunning, sourceOfTruthGolden] =
    await Promise.all([
      launchAndDetectStorybook(
        toLaunchTarget(sourceOfTruth.name, sourceOfTruthServer),
      ),
      launchAndDetectStorybook(toLaunchTarget(target.name, targetServer)),
      // The live Storybooks still work without the golden (e.g. offline), so
      // a failure here only disables Golden/Compute Diff, loudly.
      resolveSourceOfTruthGolden(engineConfig.sourceOfTruthGolden).catch(
        (err: Error) => {
          console.warn(
            `[Dev Launcher] WARNING: source-of-truth golden unavailable — Golden and Compute Diff are disabled: ${err.message}`,
          );
          return err;
        },
      ),
    ]);
  console.log(`[Dev Launcher] Dev Mode is ready!`);

  const spawned = [sourceOfTruthRunning.process, targetRunning.process].filter(
    (child): child is ChildProcess => !!child,
  );

  const app = express();
  const publicDir = join(distDir, "../public");
  const headerPath = join(distDir, "../report-header.txt");

  // Serve the Dev Mode UI at the root path ONLY if there is no query string.
  // This allows the iframe (which loads with ?path=/story/...) to pass
  // through to the proxy, avoiding an infinite loop of nested wrappers.
  const sourceOfTruthVersion = readInstalledMantineVersion(
    sourceOfTruthServer.cwd,
  );
  const goldenRoutes = registerGoldenRoutes(
    app,
    engineConfig,
    targetRunning.url,
    sourceOfTruthGolden,
    options.configPath,
  );

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
        sourceOfTruthVersion,
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
    void goldenRoutes.close().finally(() => process.exit(0));
  };
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // An explicit `--port` is strict. The default 6010 is only a first guess:
  // another Dev Mode instance often already holds it, so step to the next
  // free port rather than crash.
  const firstPort = options.port ?? DEFAULT_DEV_PORT;
  const lastPort = options.port ? firstPort : firstPort + 19;
  let boundPort = firstPort;
  for (;;) {
    try {
      await new Promise<void>((resolve, reject) => {
        const server = app.listen(boundPort);
        server.once("listening", () => resolve());
        server.once("error", reject);
      });
      break;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EADDRINUSE" || boundPort >= lastPort) {
        console.error(
          `[Dev Launcher] Dev Mode server failed to listen on port ${boundPort}: ${(err as Error).message}. Pass --port <n> to use another port.`,
        );
        for (const child of spawned) child.kill("SIGINT");
        process.exit(1);
      }
      console.log(
        `[Dev Launcher] Port ${boundPort} is in use, trying ${boundPort + 1}...`,
      );
      boundPort++;
    }
  }

  console.log(`
====================================================
🚀 Adapter Dev Mode proxy running at:
   http://localhost:${boundPort}
====================================================
`);
  openBrowser(`http://localhost:${boundPort}`);
}
