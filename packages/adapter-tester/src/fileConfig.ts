import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { AdapterTesterConfig } from "./config.js";
import type { HarnessWebServerConfig } from "./harness/mantineSourceOfTruth.js";
import { mantineSourceOfTruthWebServer } from "./harness/mantineSourceOfTruth.js";
import { validateFileConfig } from "./validateFileConfig.js";

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
  relaxedThresholdStoryIds?: string[];
  relaxedThresholdPixels?: number;
  excludeTitlePrefixes?: string[];
}

export interface ResolvedAdapterTesterConfig {
  engineConfig: AdapterTesterConfig;
  webServers: HarnessWebServerConfig[];
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
 * `runVisualRegression` consumes plus the Playwright `webServer` entries
 * needed to boot both sides of the comparison.
 *
 * Default mode (no `sourceOfTruth`/`storybook` set): compares this project's
 * own Storybook against a throwaway Mantine harness — no monorepo checkout
 * required. Set `sourceOfTruth.type: "url"` for the non-standard mode used
 * to compare sibling workspace packages inside this monorepo.
 */
export function resolveConfig(cwd: string): ResolvedAdapterTesterConfig {
  const file = loadFileConfig(cwd);

  const ownName = file.name ?? detectOwnName(cwd);
  const ownPort = file.storybook?.port ?? detectOwnPort(cwd);
  const ownCommand = file.storybook?.command ?? DEFAULT_STORYBOOK_COMMAND;
  const ownCwd = resolve(cwd, file.storybook?.cwd ?? ".");

  const sourceOfTruth = file.sourceOfTruth ?? {
    type: "mantine-harness" as const,
  };

  let sourceOfTruthName: string;
  let sourceOfTruthPort: number;
  let sourceOfTruthWebServer: HarnessWebServerConfig;

  if (sourceOfTruth.type === "url") {
    sourceOfTruthName = sourceOfTruth.name ?? DEFAULT_SOURCE_OF_TRUTH_NAME;
    sourceOfTruthPort = sourceOfTruth.port;
    sourceOfTruthWebServer = {
      command: sourceOfTruth.command ?? DEFAULT_STORYBOOK_COMMAND,
      port: sourceOfTruth.port,
      cwd: resolve(cwd, sourceOfTruth.cwd ?? "."),
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    };
  } else {
    sourceOfTruthName = DEFAULT_SOURCE_OF_TRUTH_NAME;
    sourceOfTruthPort = sourceOfTruth.port ?? DEFAULT_SOURCE_OF_TRUTH_PORT;
    sourceOfTruthWebServer = mantineSourceOfTruthWebServer({
      dir: join(cwd, ".adapter-tester/mantine-harness"),
      port: sourceOfTruthPort,
      mantineAdapterVersion: sourceOfTruth.mantineAdapterVersion,
      storybookTemplateVersion: sourceOfTruth.storybookTemplateVersion,
    });
  }

  const engineConfig: AdapterTesterConfig = {
    targets: [
      {
        name: sourceOfTruthName,
        url: `http://localhost:${sourceOfTruthPort}`,
        sourceOfTruth: true,
      },
      { name: ownName, url: `http://localhost:${ownPort}` },
    ],
    diffThresholdPixels:
      file.diffThresholdPixels ?? DEFAULT_DIFF_THRESHOLD_PIXELS,
    relaxedThresholdStoryIds: file.relaxedThresholdStoryIds,
    relaxedThresholdPixels: file.relaxedThresholdPixels,
    excludeTitlePrefixes: file.excludeTitlePrefixes,
  };

  const webServers: HarnessWebServerConfig[] = [
    sourceOfTruthWebServer,
    {
      command: ownCommand,
      port: ownPort,
      cwd: ownCwd,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ];

  return { engineConfig, webServers };
}
