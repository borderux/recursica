import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Generates a small, throwaway Storybook project that installs
 * `@recursica/mantine-adapter` as a real npm dependency (not a workspace
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

export interface MantineSourceOfTruthHarnessOptions {
  /**
   * Directory the harness project is scaffolded into. Regenerated on every
   * call — add it to your .gitignore rather than committing it.
   */
  dir: string;
  /** Port the harness's Storybook dev server boots on. */
  port: number;
  /** npm version/range for @recursica/mantine-adapter. Defaults to "latest". */
  mantineAdapterVersion?: string;
  /** npm version/range for @recursica/storybook-template. Defaults to "latest". */
  storybookTemplateVersion?: string;
}

export interface HarnessWebServerConfig {
  command: string;
  port: number;
  cwd: string;
  reuseExistingServer: boolean;
  timeout: number;
}

// Peer/dev ranges pinned to what @recursica/mantine-adapter and
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

// mantine-adapter's Introduction.stories.tsx (Version.tsx/OverStyling.tsx)
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
  port: number;
}) {
  return {
    name: "adapter-tester-mantine-source-of-truth-harness",
    private: true,
    type: "module",
    scripts: {
      storybook: `storybook dev -p ${options.port}`,
    },
    dependencies: {
      "@recursica/mantine-adapter": options.mantineAdapterVersion,
      "@recursica/storybook-template": options.storybookTemplateVersion,
      "@recursica/official-release": "latest",
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
    "../node_modules/@recursica/mantine-adapter/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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

const PREVIEW_TSX = `import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@recursica/adapter-common/style.css";
import "@recursica/official-release/recursica_variables_scoped.css";
import recursicaTokens from "@recursica/official-release/recursica_tokens.json";
import recursicaBrand from "@recursica/official-release/recursica_brand.json";
import recursicaUIKit from "@recursica/official-release/recursica_ui-kit.json";

const basePreview = createPreviewConfig({
  defaultTheme: "light",
  recursicaTokensJsonPath: recursicaTokens,
  recursicaBrandJsonPath: recursicaBrand,
  recursicaUIKitJsonPath: recursicaUIKit,
});

const preview: Preview = {
  ...basePreview,
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
    ...(basePreview.decorators || []),
  ],
};

export default preview;
`;

/** Writes the harness project's files to `options.dir` without booting it. */
export function scaffoldMantineSourceOfTruthHarness(
  options: MantineSourceOfTruthHarnessOptions,
): string {
  const {
    dir,
    port,
    mantineAdapterVersion = "latest",
    storybookTemplateVersion = "latest",
  } = options;

  mkdirSync(join(dir, ".storybook"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      harnessPackageJson({
        mantineAdapterVersion,
        storybookTemplateVersion,
        port,
      }),
      null,
      2,
    ) + "\n",
  );
  writeFileSync(join(dir, ".storybook/main.ts"), MAIN_TS);
  writeFileSync(join(dir, ".storybook/preview.tsx"), PREVIEW_TSX);
  writeFileSync(join(dir, ".gitignore"), "node_modules\n");

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
  return {
    command: "npm install --no-audit --no-fund && npm run storybook",
    port: options.port,
    cwd: dir,
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  };
}
