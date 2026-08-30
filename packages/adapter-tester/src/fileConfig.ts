import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type {
  AdapterTesterConfig,
  SourceOfTruthGoldenLocation,
  StoryOverride,
} from "./config.js";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";
import { mantineSourceOfTruthWebServer } from "./harness/mantineSourceOfTruth.js";
import { validateFileConfig } from "./validateFileConfig.js";

const MANTINE_ADAPTER_PACKAGE_NAME = "@recursica/mantine-adapter";

export const CONFIG_FILE_NAME = "adapter-tester.config.json";
const DEFAULT_STORYBOOK_COMMAND = "npm run storybook";
const DEFAULT_STORYBOOK_PORT = 6006;
const DEFAULT_SOURCE_OF_TRUTH_PORT = 6011;
const DEFAULT_SOURCE_OF_TRUTH_NAME = "Mantine";
const DEFAULT_DIFF_THRESHOLD_PIXELS = 3500;

interface StorybookTargetFileConfig {
  /** Port the target's Storybook is served on. Auto-detected from this
   * project's own `scripts.storybook` (a `-p <port>`/`--port <port>` flag)
   * when omitted, falling back to Storybook's own default of 6006. */
  port?: number;
  /** Command that boots the target's Storybook. Defaults to `npm run storybook`. */
  command?: string;
  /** Directory the command runs in, relative to the config file. Defaults to "." */
  cwd?: string;
}

interface MantineHarnessSourceOfTruthFileConfig {
  /** Default mode: boots a throwaway harness that installs the published
   * `@recursica/mantine-adapter` from npm — no monorepo checkout required. */
  type?: "mantine-harness";
  port?: number;
  mantineAdapterVersion?: string;
  storybookTemplateVersion?: string;
}

interface UrlSourceOfTruthFileConfig {
  /** Non-standard mode: points at an already-addressable Storybook — e.g. a
   * sibling workspace package's own Storybook inside this monorepo. */
  type: "url";
  name?: string;
  port: number;
  command?: string;
  cwd?: string;
}

type SourceOfTruthFileConfig =
  | MantineHarnessSourceOfTruthFileConfig
  | UrlSourceOfTruthFileConfig;

export interface AdapterTesterFileConfig {
  /** Label for this project's own target. Defaults to the unscoped name in
   * this project's package.json (e.g. "@recursica/mui-adapter" -> "mui-adapter"). */
  name?: string;
  storybook?: StorybookTargetFileConfig;
  sourceOfTruth?: SourceOfTruthFileConfig;
  diffThresholdPixels?: number;
  stories?: Record<string, StoryOverride>;
  excludeTitlePrefixes?: string[];
  /**
   * True only for the source-of-truth adapter's own config (mantine-adapter).
   * Skips `sourceOfTruth` entirely — there's nothing above it to diverge
   * from — and runs the own-drift golden check standalone, against just this
   * project's own Storybook. Defaults to false.
   */
  isSourceOfTruthAdapter?: boolean;
}

export interface ResolvedAdapterTesterConfig {
  engineConfig: AdapterTesterConfig;
  webServers: HarnessWebServerConfig[];
}

export interface ResolveConfigOverrides {
  /** From `--source-of-truth-version`. Overrides `sourceOfTruth.mantineAdapterVersion`. */
  mantineAdapterVersion?: string;
}

function readOwnPackageJson(cwd: string): any {
  const path = join(cwd, "package.json");
  if (!existsSync(path)) {
    throw new Error(
      `No package.json found in ${cwd} — run adapter-tester from the root of the project being tested.`,
    );
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function detectOwnPort(cwd: string): number {
  const pkg = readOwnPackageJson(cwd);
  const storybookScript = pkg.scripts?.storybook as string | undefined;
  const match = storybookScript?.match(/(?:-p|--port)[ =](\d+)/);
  return match ? Number(match[1]) : DEFAULT_STORYBOOK_PORT;
}

function detectOwnName(cwd: string): string {
  const pkg = readOwnPackageJson(cwd);
  const name = pkg.name as string | undefined;
  return name ? name.split("/").pop()! : "Adapter";
}

function loadFileConfig(cwd: string): AdapterTesterFileConfig {
  const path = join(cwd, CONFIG_FILE_NAME);
  if (!existsSync(path)) {
    return {};
  }
  const data = JSON.parse(readFileSync(path, "utf8"));
  validateFileConfig(data, path);
  return data;
}

/**
 * Loads `adapter-tester.config.json` from `cwd` (or falls back to defaults
 * when the file doesn't exist) and resolves it into the engine config
 * `resolveVisualRegressionPlan` consumes plus the Playwright `webServer` entries
 * needed to boot both sides of the comparison.
 *
 * Default mode (no `sourceOfTruth`/`storybook` set): compares this project's
 * own Storybook against a throwaway Mantine harness — no monorepo checkout
 * required. Set `sourceOfTruth.type: "url"` for the non-standard mode used
 * to compare sibling workspace packages inside this monorepo.
 *
 * `overrides.mantineAdapterVersion` (from `--source-of-truth-version`) pins
 * the mantine-harness install/golden-fetch version for this run, overriding
 * `sourceOfTruth.mantineAdapterVersion`. Throws if passed together with
 * `isSourceOfTruthAdapter` or `sourceOfTruth.type: "url"` — neither has a
 * version to pin.
 */
export function resolveConfig(
  cwd: string,
  overrides: ResolveConfigOverrides = {},
): ResolvedAdapterTesterConfig {
  const file = loadFileConfig(cwd);
  const isSourceOfTruthAdapter = file.isSourceOfTruthAdapter ?? false;

  if (overrides.mantineAdapterVersion && isSourceOfTruthAdapter) {
    throw new Error(
      "--source-of-truth-version has no effect on the source-of-truth adapter's own config (isSourceOfTruthAdapter: true) — there's nothing to pin a version for.",
    );
  }

  const ownName = file.name ?? detectOwnName(cwd);
  const ownPort = file.storybook?.port ?? detectOwnPort(cwd);
  const ownCommand = file.storybook?.command ?? DEFAULT_STORYBOOK_COMMAND;
  const ownCwd = resolve(cwd, file.storybook?.cwd ?? ".");
  const ownWebServer: HarnessWebServerConfig = {
    command: ownCommand,
    port: ownPort,
    cwd: ownCwd,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  };

  const sharedEngineConfig = {
    diffThresholdPixels:
      file.diffThresholdPixels ?? DEFAULT_DIFF_THRESHOLD_PIXELS,
    stories: file.stories,
    excludeTitlePrefixes: file.excludeTitlePrefixes,
    // Keyed off `ownCwd`, not `cwd` — the project actually being tested, not
    // wherever the config file happens to live. Matters whenever
    // `storybook.cwd` points at a sibling package: its goldens must resolve
    // to that package's own `test/golden/` (the same directory used when
    // that package runs adapter-tester directly), not a directory under
    // wherever this config file lives.
    goldenDir: join(ownCwd, "test", "golden"),
    isSourceOfTruthAdapter,
    // Overwritten by the CLI from --update-golden/--approve-divergence.
    goldenMode: "check" as const,
    // Overwritten by the CLI from --divergence-only.
    checkMode: "own" as const,
  };

  // The source-of-truth adapter's own config has nothing above it to
  // diverge from — no second target, no harness/webServer for it at all.
  if (isSourceOfTruthAdapter) {
    return {
      engineConfig: {
        ...sharedEngineConfig,
        targets: [{ name: ownName, url: `http://localhost:${ownPort}` }],
      },
      webServers: [ownWebServer],
    };
  }

  const sourceOfTruth = file.sourceOfTruth ?? {
    type: "mantine-harness" as const,
  };

  let sourceOfTruthName: string;
  let sourceOfTruthPort: number;
  let sourceOfTruthWebServer: HarnessWebServerConfig;
  let sourceOfTruthGolden: SourceOfTruthGoldenLocation;

  if (sourceOfTruth.type === "url") {
    if (overrides.mantineAdapterVersion) {
      throw new Error(
        '--source-of-truth-version has no effect with sourceOfTruth.type: "url" — that mode reads a sibling package\'s local checkout directly, not a published version.',
      );
    }
    sourceOfTruthName = sourceOfTruth.name ?? DEFAULT_SOURCE_OF_TRUTH_NAME;
    sourceOfTruthPort = sourceOfTruth.port;
    const sourceOfTruthCwd = resolve(cwd, sourceOfTruth.cwd ?? ".");
    sourceOfTruthWebServer = {
      command: sourceOfTruth.command ?? DEFAULT_STORYBOOK_COMMAND,
      port: sourceOfTruth.port,
      cwd: sourceOfTruthCwd,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    };
    // Sibling package already checked out locally — read its golden files
    // directly, including any uncommitted local changes. No install, no
    // network call.
    sourceOfTruthGolden = {
      type: "local",
      dir: join(sourceOfTruthCwd, "test", "golden"),
    };
  } else {
    sourceOfTruthName = DEFAULT_SOURCE_OF_TRUTH_NAME;
    sourceOfTruthPort = sourceOfTruth.port ?? DEFAULT_SOURCE_OF_TRUTH_PORT;
    const mantineAdapterVersion =
      overrides.mantineAdapterVersion ?? sourceOfTruth.mantineAdapterVersion;
    sourceOfTruthWebServer = mantineSourceOfTruthWebServer({
      dir: join(cwd, ".adapter-tester/mantine-harness"),
      port: sourceOfTruthPort,
      mantineAdapterVersion,
      storybookTemplateVersion: sourceOfTruth.storybookTemplateVersion,
    });
    // No local checkout — resolve the installed version against the npm
    // registry and fetch that version's golden files from the public repo.
    // Never needs `sourceOfTruthWebServer` above; the golden check on its
    // own doesn't boot a second Storybook at all (see cli.ts).
    sourceOfTruthGolden = {
      type: "npm",
      packageName: MANTINE_ADAPTER_PACKAGE_NAME,
      versionSpec: mantineAdapterVersion ?? "latest",
      cacheDir: join(cwd, ".adapter-tester/mantine-golden-cache"),
    };
  }

  return {
    engineConfig: {
      ...sharedEngineConfig,
      targets: [
        {
          name: sourceOfTruthName,
          url: `http://localhost:${sourceOfTruthPort}`,
          sourceOfTruth: true,
        },
        { name: ownName, url: `http://localhost:${ownPort}` },
      ],
      sourceOfTruthGolden,
    },
    // [sourceOfTruth, own] — Dev Mode needs both; the automated golden run
    // (cli.ts) only ever boots the last entry, since its divergence check
    // reads stored golden files, not a live source-of-truth page.
    webServers: [sourceOfTruthWebServer, ownWebServer],
  };
}
