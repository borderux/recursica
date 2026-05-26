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

1. **Story Extraction**: The script fetches the `index.json` from both Storybook instances to compile a list of all shared `ui-kit-*` stories.
2. **Headless Snapshots**: It launches Playwright (Chromium) in the background and navigates to the isolated iframe URLs for both adapters.
3. **Pixel Diffing**: It captures screenshots and uses `pixelmatch` to generate a diff overlay.
4. **Report Generation**: A static HTML report is generated detailing matches and discrepancies.

### Output & Reports

The execution generates files in two main directories (ignored by Git):

- `/diffs`: Contains the raw screenshots (`[story]-mantine.png` and `[story]-mui.png`) as well as the highlighted discrepancy image (`[story]-diff.png`).
- `/report`: Contains an `index.html` file that you can open in your browser to visually review the test results, including the amount of mismatched pixels and the "before/after" diff overlays.
