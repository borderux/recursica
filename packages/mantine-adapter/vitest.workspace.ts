import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineWorkspace } from "vitest/config";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineWorkspace([
  "vite.config.ts",
  {
    // Plain unit tests for functional code (utils) — no browser, no components.
    extends: "vite.config.ts",
    test: {
      name: "unit",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  },
  {
    // DOM tests that need a real browser (e.g. verifying no CSS bleed between a Recursica
    // component and the underlying kit component it wraps). Plain vitest tests, not Storybook
    // stories — kept out of the "storybook" project below by file naming convention.
    // Not run by `npm test`/CI — opt in with `npm run test:dom`.
    extends: "vite.config.ts",
    test: {
      name: "dom",
      browser: {
        enabled: true,
        headless: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
      include: ["src/**/*.dom.test.tsx"],
    },
  },
  {
    extends: "vite.config.ts",
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({ configDir: path.join(dirname, ".storybook") }),
    ],
    test: {
      name: "storybook",
      browser: {
        enabled: true,
        headless: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
      setupFiles: [".storybook/vitest.setup.ts"],
    },
  },
]);
