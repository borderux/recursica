import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { AdapterTesterConfig } from "./config.js";
import { startDevServer } from "./devServer.js";
import { resolveConfig } from "./fileConfig.js";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";
import { launchAndDetectStorybook, toLaunchTarget } from "./portDiscovery.js";

// `dist/testing.js` is always a sibling of this file — both inside a
// consumer's node_modules/@recursica/adapter-tester/dist and inside this
// monorepo's own packages/adapter-tester/dist when self-hosting — so the
// generated spec below can reach it without depending on how the package
// itself resolves at import time.
const distDir = dirname(fileURLToPath(import.meta.url));
const testingEntry = pathToFileURL(join(distDir, "testing.js")).href;

// `--source-of-truth-version <value>` takes a value, unlike every other own
// flag below — pulled out of argv first so the boolean flags/passthrough
// logic never has to know it exists.
const args = process.argv.slice(2);
let sourceOfTruthVersion: string | undefined;
const sourceOfTruthVersionFlagIndex = args.indexOf("--source-of-truth-version");
if (sourceOfTruthVersionFlagIndex !== -1) {
  const value = args[sourceOfTruthVersionFlagIndex + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(
      "--source-of-truth-version requires a value, e.g. --source-of-truth-version 0.53.0",
    );
  }
  sourceOfTruthVersion = value;
  args.splice(sourceOfTruthVersionFlagIndex, 2);
}

const cwd = process.cwd();
const { engineConfig, webServers } = resolveConfig(cwd, {
  mantineAdapterVersion: sourceOfTruthVersion,
});

if (args.includes("--update-golden")) {
  engineConfig.goldenMode = "update-golden";
} else if (args.includes("--approve-divergence")) {
  engineConfig.goldenMode = "approve-divergence";
}

if (args.includes("--divergence-only")) {
  if (engineConfig.isSourceOfTruthAdapter) {
    throw new Error(
      "--divergence-only has nothing to diverge from — isSourceOfTruthAdapter is true in this project's adapter-tester.config.json.",
    );
  }
  engineConfig.checkMode = "divergence";
} else if (engineConfig.goldenMode === "approve-divergence") {
  throw new Error(
    "--approve-divergence only makes sense with --divergence-only — there's nothing to approve without the divergence check running.",
  );
}

if (args.includes("--dry-run")) {
  console.log(JSON.stringify({ engineConfig, webServers }, null, 2));
  process.exit(0);
}

// Any arg besides our own flags is passed straight through to `playwright
// test` — e.g. `npm run adapter-tester:automated -- --grep "Toast"` to scope
// a run to matching stories, instead of every invocation running the full
// suite. Our own flags are consumed above, not forwarded — Playwright itself
// doesn't know about them.
const OWN_FLAGS = new Set([
  "--dry-run",
  "--serve",
  "--update-golden",
  "--approve-divergence",
  "--divergence-only",
]);
const passthroughArgs = args.filter((arg) => !OWN_FLAGS.has(arg));

// The bundled build target doesn't support top-level await, so the async
// work (launching Storybook and detecting its real port) lives in main().
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

async function main(): Promise<void> {
  if (args.includes("--serve")) {
    if (engineConfig.isSourceOfTruthAdapter) {
      throw new Error(
        "Dev Mode (--serve) has nothing to sync this project's Storybook against — isSourceOfTruthAdapter is true in this project's adapter-tester.config.json.",
      );
    }
    // Dual-Storybook interactive Dev Mode — no Playwright, no screenshots.
    // Used by the `adapter-tester` npm script.
    await startDevServer(engineConfig, webServers);
  } else {
    // The golden-image checks never need the source-of-truth adapter's own
    // Storybook running — the divergence check reads its stored golden files,
    // not a live page — so only the last (own) webServer is booted here. Dev
    // Mode above is the one thing that still needs both.
    const ownWebServer = webServers.at(-1);
    if (!ownWebServer) {
      throw new Error("resolveConfig() returned no webServers to boot.");
    }
    await runAutomated(ownWebServer, engineConfig);
  }
}

/**
 * Boots this project's own Storybook (auto-detecting the port it actually
 * lands on — see portDiscovery.ts), generates a throwaway Playwright config
 * + spec under `.adapter-tester/run/`, and runs the automated pixel-diff
 * suite against it. Used by the `adapter-tester:automated` npm script.
 *
 * Playwright's own `webServer` option can't be used here — it only knows how
 * to poll a port/URL decided *before* the command it spawns runs, but
 * Storybook silently falls back to a different, OS-assigned port whenever
 * its configured one is taken. So this boots and waits for Storybook itself,
 * then points the generated config straight at whatever URL it actually
 * reports.
 */
async function runAutomated(
  server: HarnessWebServerConfig,
  config: AdapterTesterConfig,
): Promise<void> {
  const runDir = join(cwd, ".adapter-tester/run");
  mkdirSync(runDir, { recursive: true });

  const ownTarget = config.targets.at(-1);
  if (!ownTarget) {
    throw new Error("resolveConfig() returned no targets to check.");
  }
  const { url, process: spawned } = await launchAndDetectStorybook(
    toLaunchTarget(ownTarget.name, server),
  );
  ownTarget.url = url;

  writeFileSync(
    join(runDir, "playwright.config.js"),
    `// Generated by \`adapter-tester\` — do not edit, regenerated on every run.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ${JSON.stringify(runDir)},
  // Each golden check only reads/writes its own story's manifest.json entry,
  // under a lock, so concurrent workers never race each other (see
  // \`updateManifestEntry\`). Defaults to 1 worker (1 Chromium instance) to
  // avoid exhausting memory running the full suite; override with
  // \`--workers <n>\` (forwarded straight through to Playwright) to parallelize.
  workers: 1,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: { trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // No webServer entry — this project's own Storybook is already running by
  // the time this config is used (see runAutomated() in cli.ts).
});
`,
  );

  writeFileSync(
    join(runDir, "visual-regression.spec.js"),
    `// Generated by \`adapter-tester\` — do not edit, regenerated on every run.
import { test, expect } from "@playwright/test";
import { resolveVisualRegressionPlan } from ${JSON.stringify(testingEntry)};

// \`test.describe\`/\`test\` are called here, not inside resolveVisualRegressionPlan,
// so Playwright's HTML report groups the suite under this file instead of a
// sourcemapped path into adapter-tester's own library code.
const { ownTargetName, suiteLabel, stories, missingFromSourceOfTruth, checkStory } =
  await resolveVisualRegressionPlan(${JSON.stringify(config, null, 2)});

test.describe(\`\${ownTargetName} — \${suiteLabel}\`, () => {
  if (missingFromSourceOfTruth.length > 0) {
    test("story parity with source of truth", () => {
      expect(
        missingFromSourceOfTruth,
        \`\${missingFromSourceOfTruth.length} stor(y/ies) exist in the source of truth but are missing here. Add the missing story, or mark it \\\`exclude: true\\\` under \\\`stories\\\` in adapter-tester.config.json if intentional.\`,
      ).toEqual([]);
    });
  }
  for (const story of stories) {
    test(story.id, async ({ browser }, testInfo) => {
      await checkStory(story, browser, testInfo);
    });
  }
});
`,
  );

  try {
    const result = spawnSync(
      "npx",
      [
        "playwright",
        "test",
        "--config",
        join(runDir, "playwright.config.js"),
        ...passthroughArgs,
      ],
      { stdio: "inherit", cwd, shell: process.platform === "win32" },
    );
    process.exitCode = result.status ?? 1;
  } finally {
    // Only tear down the Storybook we spawned — an instance we reused via
    // the last-known-port cache was already running before we got here, and
    // should stay running after.
    spawned?.kill("SIGTERM");
  }
}
