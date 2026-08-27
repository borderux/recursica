# @recursica/adapter-tester

A specialized automated visual regression testing engine and interactive developer environment for Recursica adapters.

## Overview

The `@recursica/adapter-tester` ensures that a Recursica adapter's components visually match Recursica's design tokens and Mantine as the source-of-truth adapter.

This package provides three primary utilities:

1. **Automated Visual Tests:** Headless, pixel-by-pixel regression checks for all stories.
2. **Interactive Dev Mode:** A side-by-side synchronized browser environment with built-in note taking for auditing components and feeding fixes directly to an AI agent.
3. **An installable library** (`import ... from "@recursica/adapter-tester"`) so any adapter repo — including ones that never checked out this monorepo — can run the same comparison against its own local Storybook. See [Using this package in another adapter repo](#using-this-package-in-another-adapter-repo).

Inside this monorepo, it runs its bundled config comparing `@recursica/mantine-adapter` (source of truth) against `@recursica/mui-adapter`, both launched as sibling workspace packages — see `adapter-tester.config.ts`.

---

## Prerequisites

Before running the tester or dev mode, ensure that both adapter Storybooks are running locally on their assigned odd ports to prevent clashing:

- **Mantine Adapter (Source of Truth)**: `http://localhost:6011`
- **MUI Adapter (Target)**: `http://localhost:6012`

_(Launch these from their respective package directories using `npm run storybook`)_

---

## Interactive Dev Mode

The **Dev Mode** is a powerful visual auditing tool that syncs the Mantine and MUI Storybooks in real-time. When you interact with controls (like toggling 'disabled' or changing 'size') in the Mantine pane, the Dev Mode instantly updates the MUI pane to match that exact state.

### How to Start

1. Ensure the Storybooks are running on `6011` and `6012`.
2. Run the Dev Mode server:
   ```bash
   cd packages/adapter-tester
   npm run dev
   ```
3. Open your browser to [http://localhost:6010](http://localhost:6010).

### Taking Component Notes

The bottom portion of the right panel features a **Component Notes** area.

- As you navigate through different component states, this text area automatically switches context.
- Your notes are instantly and persistently saved to your browser's `localStorage`, strictly bound to the exact Storybook URL configuration (e.g., `ui-kit-slider--default | disabled:true`).

### Generating an AI Report

When you are done auditing discrepancies, click the **Full Report** button in the notes header.

This will crawl your local storage and compile every note you've taken into a clean, markdown-formatted report. The report maps your notes to human-readable component headers and exact Storybook configuration URLs.

#### Modifying the AI Prompt Header

The compiled report is specifically designed to be copy-pasted directly into an AI coding assistant. It begins with a system prompt block that tells the AI exactly what the report represents and how to apply the fixes.

You can modify this instructional header at any time by editing:
`packages/adapter-tester/report-header.txt`

The Dev Mode server fetches this file dynamically, so any changes you make to `report-header.txt` will instantly appear the next time you click **Full Report**—no restart required!

---

## Automated Visual Tests

To execute a full headless visual regression scan across all components:

```bash
cd packages/adapter-tester
npm run test:visual
```

### What happens during execution?

1. **Automatic Storybook Bootup**: The testing engine checks ports `6011` and `6012`. If they are inactive, it automatically starts the Mantine and MUI Storybooks in the background and cleans them up upon exit. If they are already active, it instantly reuses them.
2. **Story Discovery**: The test suite fetches the source of truth's Storybook index (`http://localhost:6011/index.json`) to dynamically discover and parameterize tests for every component story, excluding `@recursica/storybook-template`'s own default token/theme demo stories (`Theme/*`, `Tokens/*`) and each adapter's own onboarding stories (`Introduction/*`).
3. **Headless Snapshots**: It launches headless Chrome in the background, navigates to the isolated iframe views for both adapters, and takes side-by-side snapshots.
4. **Pixel Diffing**: It diffs the images using `pixelmatch` against our global mismatch threshold.
5. **Native Report Generation**: All raw snapshots, highlighted pixel diff overlays, and extracted computed CSS DOM trees are embedded directly as test attachments.

### Output & Reports

All test outcomes and visual outputs are compiled into the standard, git-ignored Playwright reports folder:

- **Interactive HTML Dashboard**: View the full side-by-side browser layout, visual difference overlays, and style audits by opening:
  `packages/adapter-tester/playwright-report/index.html`
- **Review in Browser**: Open the interactive dashboard directly from your terminal by running:
  ```bash
  npx playwright show-report
  ```
- **Raw Screenshot Assets**: Individual screenshot buffers and visual diff outputs are retained in the standard `packages/adapter-tester/test-results/` folder for reference.

---

## Using this package in another adapter repo

`@recursica/adapter-tester` is a real, installable devDependency — a standalone adapter repo (not checked out inside this monorepo) can use it to diff its own Storybook against Mantine, Recursica's source-of-truth adapter, without cloning this monorepo at all.

```bash
npm install --save-dev @recursica/adapter-tester
```

Add a config listing your adapter's already-running local Storybook alongside a Mantine source-of-truth target:

```ts
// adapter-tester.config.ts
import { defineAdapterTesterConfig } from "@recursica/adapter-tester";

export default defineAdapterTesterConfig({
  targets: [
    { name: "Mantine", url: "http://localhost:6011", sourceOfTruth: true },
    { name: "MyAdapter", url: "http://localhost:6006" },
  ],
  diffThresholdPixels: 3500,
});
```

Wire the Mantine side up as a `playwright.config.ts` `webServer` entry with `mantineSourceOfTruthWebServer()` — it scaffolds a small throwaway project that installs the real, published `@recursica/mantine-adapter` package and boots a real Storybook from it, so you never need this monorepo checked out:

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";
import { mantineSourceOfTruthWebServer } from "@recursica/adapter-tester";
import config from "./adapter-tester.config";

export default defineConfig({
  testDir: "./tests",
  webServer: [
    mantineSourceOfTruthWebServer({
      dir: "./.adapter-tester/mantine-harness", // add to .gitignore
      port: 6011,
    }),
    {
      command: "npm run storybook", // your own adapter's Storybook
      port: 6006,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

Then define the test suite itself in a spec file — it diffs every non-source-of-truth target against the source of truth, story by story:

```ts
// tests/visual-regression.spec.ts
import { runVisualRegression } from "@recursica/adapter-tester/testing";
import config from "../adapter-tester.config";

await runVisualRegression(config);
```

```bash
npx playwright test
```

Notes:

- `mantineSourceOfTruthWebServer()` regenerates its harness directory on every run — commit `.adapter-tester/` to your `.gitignore` rather than checking it in.
- Pass `mantineAdapterVersion`/`storybookTemplateVersion` to pin the harness to a specific published release instead of tracking `latest`.
- `defineAdapterTesterConfig` requires exactly one target marked `sourceOfTruth: true`; it throws otherwise.
