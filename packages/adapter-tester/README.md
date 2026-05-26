# @recursica/adapter-tester

A specialized automated visual regression testing engine and interactive developer environment for the Recursica monorepo.

## Overview

The `@recursica/adapter-tester` ensures that all UI components built in the target `@recursica/mui-adapter` visually match their source-of-truth counterparts in the `@recursica/mantine-adapter`.

This package provides two primary utilities:

1. **Automated Visual Tests:** Headless, pixel-by-pixel regression checks for all stories.
2. **Interactive Dev Mode:** A side-by-side synchronized browser environment with built-in note taking for auditing components and feeding fixes directly to an AI agent.

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
2. **Story Discovery**: The test suite fetches the Storybook index (`http://localhost:6011/index.json`) to dynamically discover and parameterize tests for every single component story under the `ui-kit-` group.
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
