import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The 4 Recursica token files every real adapter commits at its own repo root. */
const TOKEN_FILES = [
  "recursica_variables_scoped.css",
  "recursica_tokens.json",
  "recursica_brand.json",
  "recursica_ui-kit.json",
];

/**
 * Generates a small, throwaway Storybook project that installs
 * `@recursica/adapter-mantine-v8` as a real npm dependency (not a workspace
 * link) and boots a real Storybook from its published `src/**\/*.stories.tsx`
 * files, using `@recursica/storybook-template`'s exported factories.
 *
 * This lets any repo — including ones that never checked out the Recursica
 * monorepo — run adapter-tester's visual regression suite against Mantine
 * (Recursica's source-of-truth adapter) as one side of the comparison, while
 * the other side is that repo's own already-running local Storybook.
 *
 * See PROPOSAL-installed-package-harness.md for the verified prototype this
 * is built from, and the three upstream gaps it works around.
 */

/**
 * Which Recursica token snapshot the harness's Mantine components render
 * with:
 *
 * - `"target"` (default): the target adapter's own committed
 *   `recursica_variables_scoped.css`/`recursica_tokens.json`/
 *   `recursica_brand.json`/`recursica_ui-kit.json` (read from `targetDir`,
 *   copied into the harness once `npm install` finishes) — makes the
 *   divergence check mean exactly "given the *same* tokens this target
 *   adapter is using, does it render the same as Mantine's own components,"
 *   isolating adapter-mapping correctness from any token-snapshot drift
 *   between the two repos.
 * - `"mantine-package"`: `@recursica/adapter-mantine-v8`'s own bundled
 *   token files (whatever it was last published with) — tests against
 *   Mantine's own understanding of the tokens instead, which also (as a
 *   side effect) flags a target repo whose own committed tokens have gone
 *   stale relative to Mantine's.
 *
 * Never `@recursica/official-release` — confirmed live (not a theoretical
 * concern) to be a stale, deprecated, generic token snapshot unrelated to
 * either adapter's real ones: it resolves the brand's primary/secondary
 * fonts to Lexend/Bellota Text, not this design system's actual Dongle/
 * Nunito Sans. An earlier version of this harness imported from it
 * directly — this type/its two real options replace that entirely.
 */
export type MantineSourceOfTruthTokensSource = "target" | "mantine-package";

export interface MantineSourceOfTruthHarnessOptions {
  /**
   * Directory the harness project is scaffolded into. Regenerated on every
   * call — add it to your .gitignore rather than committing it.
   */
  dir: string;
  /** First-guess port, shown for `--dry-run` visibility only. The harness's
   * Storybook is never pinned to this — see `HarnessWebServerConfig.port`. */
  port: number;
  /** npm version/range for @recursica/adapter-mantine-v8. Defaults to "latest". */
  mantineAdapterVersion?: string;
  /** npm version/range for @recursica/storybook-template. Defaults to "latest". */
  storybookTemplateVersion?: string;
  /** See `MantineSourceOfTruthTokensSource`. Defaults to `"target"`. */
  tokensSource?: MantineSourceOfTruthTokensSource;
  /**
   * The target adapter's own repo root — required when `tokensSource` is
   * `"target"` (the default), the source the 4 token files are copied
   * from. Unused (and not required) for `"mantine-package"`.
   */
  targetDir?: string;
}

export interface HarnessWebServerConfig {
  command: string;
  /** First-guess port, shown for `--dry-run` visibility only — not
   * authoritative. The real port is whatever this Storybook's own startup
   * banner reports once it's actually running (see portDiscovery.ts), since
   * Storybook silently falls back to an OS-assigned port whenever this one
   * is taken. */
  port: number;
  cwd: string;
  reuseExistingServer: boolean;
  /** File the real, detected port is cached in between runs, so a later
   * `reuseExistingServer` run can find this instance again. */
  cacheFile: string;
  timeout: number;
}

// Peer/dev ranges pinned to what @recursica/adapter-mantine-v8 and
// @recursica/storybook-template themselves require, so the harness can't
// drift onto an incompatible Mantine or Storybook major version.
const MANTINE_CORE_RANGE = "^8.0.0";
const STORYBOOK_RANGE = "^10.3.3";
const REACT_RANGE = "^19.0.0";

// storybook-template's createMainConfig() defaults its addons list to these
// three but doesn't declare them as peerDependencies (proposal gap 2) — a
// harness that skips installing any of them gets a silent "could not
// resolve addon" warning at boot, then a hard runtime crash later when Vite
// pre-bundles preview.tsx's dependency graph. Installed explicitly here.
const DEFAULT_ADDON_DEPENDENCIES = {
  "@storybook/addon-docs": STORYBOOK_RANGE,
  "@storybook/addon-a11y": STORYBOOK_RANGE,
  "storybook-dark-mode": "^5.0.0",
};

// adapter-mantine-v8's Introduction.stories.tsx (Version.tsx/OverStyling.tsx)
// needs react-markdown, but it's a devDependency there — Storybook-only,
// never bundled into dist — so an external `npm install` of the published
// package won't pull it in. The harness boots a real Storybook against
// src/, so it must provide this itself. Installed explicitly here.
const WORKAROUND_DEPENDENCIES = {
  "react-markdown": "^10.1.0",
};

function harnessPackageJson(options: {
  mantineAdapterVersion: string;
  storybookTemplateVersion: string;
}) {
  return {
    name: "adapter-tester-mantine-source-of-truth-harness",
    private: true,
    type: "module",
    scripts: {
      // No `-p` pin — Storybook silently falls back to an OS-assigned port
      // whenever its default is taken, so the caller detects the real port
      // from this process's own output rather than trusting a fixed one.
      storybook: `storybook dev`,
    },
    dependencies: {
      "@recursica/adapter-mantine-v8": options.mantineAdapterVersion,
      "@recursica/storybook-template": options.storybookTemplateVersion,
      "@recursica/adapter-common": "latest",
      "@mantine/core": MANTINE_CORE_RANGE,
      "@mantine/dates": MANTINE_CORE_RANGE,
      react: REACT_RANGE,
      "react-dom": REACT_RANGE,
      storybook: STORYBOOK_RANGE,
      "@storybook/react-vite": STORYBOOK_RANGE,
      ...DEFAULT_ADDON_DEPENDENCIES,
      ...WORKAROUND_DEPENDENCIES,
    },
  };
}

const MAIN_TS = `import { createMainConfig } from "@recursica/storybook-template/main";

const config = createMainConfig({
  stories: [
    "../node_modules/@recursica/adapter-mantine-v8/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  enableCORS: true,
});

// react-docgen-typescript can't resolve a TS project for a config file living
// in .storybook/ when the component source it's docgen'ing lives three
// directories down inside node_modules — it throws "Cannot read properties
// of undefined (reading 'fileExists')", which surfaces as a plain 404 on
// preview.tsx. Docgen only powers Storybook's Controls/Docs tables, which
// this harness never renders, so disabling it is a safe workaround (see
// PROPOSAL-installed-package-harness.md, gap 3).
config.typescript = { ...config.typescript, reactDocgen: false };

export default config;
`;

// Both `tokensSource` modes copy the 4 token files into the harness's own
// root (see `copyTokensScript()`) before Storybook boots, rather than
// importing a package subpath directly — `@recursica/adapter-mantine-v8`'s
// own `package.json` `exports` map only lists `"."`/`"./style.css"`, so a
// bare `import "@recursica/adapter-mantine-v8/recursica_tokens.json"` would
// fail to resolve under strict ESM exports-map enforcement even though the
// file physically ships in the package (confirmed by reading that package's
// real, installed `package.json` directly). Copying sidesteps that
// entirely, and gives both modes the identical, simple `../recursica_*`
// relative-import shape a real adapter's own `preview.tsx` already uses.
function previewTsx(): string {
  return `import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
import { Layer } from "@recursica/adapter-common";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@recursica/adapter-common/style.css";
import "../recursica_variables_scoped.css";
import recursicaTokens from "../recursica_tokens.json";
import recursicaBrand from "../recursica_brand.json";
import recursicaUIKit from "../recursica_ui-kit.json";

const basePreview = createPreviewConfig({
  defaultTheme: "light",
  recursicaTokensJsonPath: recursicaTokens,
  recursicaBrandJsonPath: recursicaBrand,
  recursicaUIKitJsonPath: recursicaUIKit,
});

// Mirrors adapter-mantine-v8's own .storybook/preview.tsx decorator (every story defaults to
// withLayer: true, layer: 0, wrapped with 48px padding) — every real adapter's own preview.tsx
// applies this same wrapping, so a target adapter's story renders inside the same Layer
// chrome/padding the source-of-truth side does. Without this, target screenshots come out
// dramatically smaller/differently-positioned than the source of truth's (no Layer padding,
// background, or border-radius at all), which alone can blow past the pixel-diff threshold
// regardless of whether the actual Recursica tokens match — a false positive, not a real
// component bug. ColorSchemeWrapper (adapter-mantine-v8's dark-mode-toggle sync helper) is
// intentionally not replicated — it only matters for the interactive dev-mode UI, not automated
// screenshot diffing, which always runs in a single theme.
const preview: Preview = {
  ...basePreview,
  decorators: [
    (Story, context) => {
      const { withLayer = true, layer = 0 } = context.args;
      const content = <Story />;
      return (
        <MantineProvider>
          {withLayer ? (
            <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "48px" }}>
              {content}
            </Layer>
          ) : (
            content
          )}
        </MantineProvider>
      );
    },
    ...(basePreview.decorators || []),
  ],
};

export default preview;
`;
}

/**
 * Generates `copy-tokens.mjs` — run as its own step between `npm install`
 * and `npm run storybook` (see `mantineSourceOfTruthWebServer`'s `command`),
 * not inlined into `scaffoldMantineSourceOfTruthHarness` itself: for
 * `"mantine-package"` mode, the source files live inside
 * `node_modules/@recursica/adapter-mantine-v8`, which doesn't exist yet at
 * scaffold time (scaffolding runs before `npm install`) — this script only
 * runs once the package is actually on disk. `"target"` mode's source files
 * are already on disk at scaffold time, but uses the same after-install
 * timing for one consistent code path rather than two.
 */
function copyTokensScript(
  tokensSource: MantineSourceOfTruthTokensSource,
  dir: string,
  targetDir: string | undefined,
): string {
  const sourceDir =
    tokensSource === "target"
      ? targetDir!
      : join(dir, "node_modules/@recursica/adapter-mantine-v8");

  return `import { copyFileSync } from "node:fs";
import { join } from "node:path";

const sourceDir = ${JSON.stringify(sourceDir)};
const destDir = ${JSON.stringify(dir)};
const files = ${JSON.stringify(TOKEN_FILES, null, 2)};

for (const file of files) {
  copyFileSync(join(sourceDir, file), join(destDir, file));
}

console.log(\`[adapter-tester] copied Recursica tokens from \${sourceDir}\`);
`;
}

/** Writes the harness project's files to `options.dir` without booting it. */
export function scaffoldMantineSourceOfTruthHarness(
  options: MantineSourceOfTruthHarnessOptions,
): string {
  const {
    dir,
    mantineAdapterVersion = "latest",
    storybookTemplateVersion = "latest",
    tokensSource = "target",
    targetDir,
  } = options;

  if (tokensSource === "target" && !targetDir) {
    throw new Error(
      'mantineSourceOfTruthWebServer: tokensSource "target" (the default) requires targetDir — the target adapter\'s own repo root, source of its 4 committed Recursica token files.',
    );
  }

  mkdirSync(join(dir, ".storybook"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      harnessPackageJson({
        mantineAdapterVersion,
        storybookTemplateVersion,
      }),
      null,
      2,
    ) + "\n",
  );
  writeFileSync(join(dir, ".storybook/main.ts"), MAIN_TS);
  writeFileSync(join(dir, ".storybook/preview.tsx"), previewTsx());
  writeFileSync(
    join(dir, "copy-tokens.mjs"),
    copyTokensScript(tokensSource, dir, targetDir),
  );
  writeFileSync(join(dir, ".gitignore"), "node_modules\n*.json\n*.css\n");

  return dir;
}

/**
 * Scaffolds the harness and returns a Playwright `webServer` entry for it.
 * Spread the result directly into `playwright.config.ts`'s `webServer` array.
 */
export function mantineSourceOfTruthWebServer(
  options: MantineSourceOfTruthHarnessOptions,
): HarnessWebServerConfig {
  const dir = scaffoldMantineSourceOfTruthHarness(options);
  const {
    mantineAdapterVersion = "latest",
    storybookTemplateVersion = "latest",
  } = options;

  // A bare `npm install` is satisfied by a package-lock.json already sitting
  // in `dir` from a prior run and skips re-resolving against the registry
  // entirely — no network call — so a run can silently keep testing against
  // a stale @recursica/adapter-mantine-v8/storybook-template even after a newer
  // version is published. Naming the two version-pinned packages as explicit
  // `pkg@specifier` CLI args instead forces npm to re-check just those two
  // against the registry every run, while the rest of node_modules stays
  // cached. `copy-tokens.mjs` runs after install completes (see its own doc
  // comment for why) and before Storybook boots, so `preview.tsx`'s own
  // `../recursica_*` imports resolve correctly on first render.
  const command = `npm install @recursica/adapter-mantine-v8@${mantineAdapterVersion} @recursica/storybook-template@${storybookTemplateVersion} --no-audit --no-fund && node copy-tokens.mjs && npm run storybook`;

  return {
    command,
    port: options.port,
    cwd: dir,
    reuseExistingServer: !process.env.CI,
    cacheFile: join(dir, "last-port.json"),
    timeout: 180 * 1000,
  };
}
