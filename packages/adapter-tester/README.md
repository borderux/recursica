# @recursica/adapter-tester

A specialized automated visual regression testing engine and interactive developer environment for Recursica adapters.

## Overview

The `@recursica/adapter-tester` ensures that a Recursica adapter's components visually match Recursica's design tokens and Mantine as the source-of-truth adapter.

This package provides three primary utilities:

1. **Automated Visual Tests:** Headless, golden-image regression checks for all stories, run as a single CLI command (`adapter-tester`) reading a small JSON config — no Playwright config or spec files to author. See [Golden Images](#golden-images) below for the model.
2. **Interactive Dev Mode:** A side-by-side synchronized browser environment with built-in note taking for auditing components and feeding fixes directly to an AI agent.
3. **An installable devDependency**, wired into `@recursica/mantine-adapter` — the source-of-truth adapter, run in `isSourceOfTruthAdapter` mode (own-drift check only, since it has nothing above it to diverge from). Any other adapter repo — including one that never checked out this monorepo — can install it the same way. See [Using this package in another adapter repo](#using-this-package-in-another-adapter-repo).

**Default mode** (used by any adapter repo installing this package): checks this project's own Storybook — the one already defined by its `storybook` npm script — against its own committed golden images, and flags divergence from the source-of-truth adapter's (`@recursica/mantine-adapter`) own golden images. No monorepo checkout, no manual config, in most cases no config file at all.

**Non-standard mode**: this monorepo also runs adapter-tester against itself, pointed at an adapter's and `@recursica/mantine-adapter`'s local sibling workspace packages — so the divergence check sees local, uncommitted `mantine-adapter` golden changes before they're published, not whatever was last published to npm. See `adapter-tester.config.json` in this package for that config; it's the same CLI, just pointed at `sourceOfTruth.type: "url"` instead of the default Mantine harness.

---

## npm scripts

Installing `@recursica/adapter-tester` as a devDependency (see [below](#using-this-package-in-another-adapter-repo)) wires up two scripts:

```json
{
  "scripts": {
    "adapter-tester": "adapter-tester --serve",
    "adapter-tester:automated": "adapter-tester"
  }
}
```

- `npm run adapter-tester` — Interactive Dev Mode: boots both Storybooks (reusing them if already running) and opens the synced side-by-side comparison browser.
- `npm run adapter-tester:automated` — the headless Playwright pixel-diff suite; see [Automated Visual Tests](#automated-visual-tests) below.

Both boot Storybooks themselves — nothing needs to be running beforehand.

---

## Interactive Dev Mode

The **Dev Mode** is a powerful visual auditing tool that syncs the target adapter's and source-of-truth's Storybooks in real-time. The left pane is this project's own Storybook (with its full nav sidebar) and drives the sync; when you interact with controls (like toggling 'disabled' or changing 'size') there, Dev Mode instantly updates the right pane — the source of truth — to match that exact state.

### How to Start

```bash
npm run adapter-tester
```

This boots both Storybooks (reusing them if already running) and opens [http://localhost:6010](http://localhost:6010) automatically.

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
npm run adapter-tester:automated   # runs the `adapter-tester` CLI
```

`adapter-tester` reads `adapter-tester.config.json` from the current directory (or falls back to defaults if the file doesn't exist), generates a throwaway Playwright config + spec under `.adapter-tester/run/` (git-ignore this directory), and runs it. There's no Playwright config or spec file to hand-author.

Pass `--dry-run` to print the resolved config and generated files without booting anything — useful for checking what a config resolves to.

Any other args are forwarded to `playwright test`, so you can scope a run to specific stories instead of running the full suite every time:

```bash
npm run adapter-tester:automated -- --grep "Toast"
```

### What happens during execution?

1. **Automatic Storybook Bootup**: `adapter-tester` boots only this project's own Storybook — the divergence check reads the source-of-truth adapter's stored golden files, never a live Storybook, so nothing else needs to boot.
2. **Story Discovery**: The test suite fetches this project's own Storybook index (`/index.json`) to dynamically discover and parameterize tests for every component story, excluding `@recursica/storybook-template`'s own default token/theme demo stories (`Theme/*`, `Tokens/*`) and each adapter's own onboarding stories (`Introduction/*`).
3. **Headless Snapshot**: It launches headless Chrome, navigates to the isolated iframe view, and takes a screenshot.
4. **Own-Drift Check**: Diffs the screenshot against this project's own `test/golden/<story-id>.png` using `pixelmatch`, against the configured mismatch threshold. No golden yet for a story is not a failure — one is captured from this run.
5. **Divergence Check**: Diffs this project's own golden against the source-of-truth adapter's golden (skipped for the source-of-truth adapter's own config). Different and not yet reviewed via `--approve-divergence`? Flagged as a report annotation — never a failure on its own.
6. **Native Report Generation**: Screenshots, diff overlays, and divergence flags are embedded directly as test attachments/annotations.

### Output & Reports

All test outcomes and visual outputs are compiled into the standard, git-ignored Playwright reports folder:

- **Interactive HTML Dashboard**: View the full side-by-side browser layout, visual difference overlays, and style audits by opening `playwright-report/index.html`.
- **Review in Browser**: Open the interactive dashboard directly from your terminal by running:
  ```bash
  npx playwright show-report
  ```
- **Raw Screenshot Assets**: Individual screenshot buffers and visual diff outputs are retained in the standard `test-results/` folder for reference.

---

## Golden Images

Each adapter's `test/golden/` directory — committed to git, alongside a `manifest.json` tracking when each was captured — is its own baseline:

- **Own-drift check (hard fail):** this run's live render vs this project's own golden. Catches unintended CSS regressions.
- **Divergence check (soft flag, never fails a run):** this project's own golden vs the source-of-truth adapter's golden — different underlying UI libraries can legitimately render a component differently, so a divergence isn't automatically wrong, just unreviewed.

These are explicit, developer-run workflows — not run in CI, and not scoped down automatically; use `--grep` to target specific stories.

```bash
# Capture/refresh this project's own goldens for stories matching "Toast",
# from the current live render. Use after an intentional styling change.
npm run adapter-tester:automated -- --grep "Toast" --update-golden

# Review a flagged divergence from the source of truth, and accept it as
# intentional. Also (re)captures the own golden from the current live render.
npm run adapter-tester:automated -- --grep "Toast" --approve-divergence
```

`--approve-divergence` records the source-of-truth adapter's own `manifest.json` `createdAt` for that story at review time. If the source of truth's golden is recaptured later, the divergence flags again for re-review — approval isn't a permanent exemption.

A story with no golden yet (new story, or one never captured) is not a failure in either mode — one is captured from the current run automatically.

Renamed/removed stories just leave an orphaned `test/golden/<story-id>.png`/manifest entry behind; nothing prunes these automatically.

`manifest.json` is validated against [`src/golden/manifest.schema.json`](./src/golden/manifest.schema.json) on every read/write — don't hand-edit it.

---

## Configuring `adapter-tester.config.json`

All fields are optional — an adapter repo with a normal `storybook` npm script (e.g. `storybook dev -p 6012`) needs no config file at all.

Every `adapter-tester.config.json` is validated against [`src/adapter-tester.schema.json`](./src/adapter-tester.schema.json) before a run — unknown fields, wrong types, and invalid `sourceOfTruth` shapes fail fast with a specific error instead of silently doing the wrong thing. Point your editor at it for autocomplete/inline docs:

```json
{
  "$schema": "./node_modules/@recursica/adapter-tester/src/adapter-tester.schema.json",
  "name": "MyAdapter",
  "storybook": { "port": 6006, "command": "npm run storybook" },
  "sourceOfTruth": { "type": "mantine-harness" },
  "diffThresholdPixels": 3500,
  "storyThresholds": { "ui-kit-slider": 15000 },
  "excludeTitlePrefixes": ["Theme", "Tokens", "Introduction"],
  "excludeStoryIds": ["ui-kit-slider--range-mode-with-icons-and-inputs"]
}
```

- `name` — label for this project's own target. Defaults to the unscoped `package.json` name.
- `storybook.port` — defaults to whatever `-p`/`--port` is set on this project's own `storybook` script; falls back to Storybook's default of `6006`.
- `storybook.command`/`storybook.cwd` — default to `npm run storybook` in the current directory.
- `sourceOfTruth` — defaults to `{ "type": "mantine-harness" }`: a throwaway harness that installs the _published_ `@recursica/mantine-adapter` from npm, so you never need this monorepo checked out. This is the standard mode every external adapter repo uses.
- `sourceOfTruth.type: "url"` — the **non-standard** mode: points at an already-addressable Storybook via `command`/`port`/`cwd` instead of the harness, and reads that sibling package's `test/golden/` directly from disk for the divergence check (including uncommitted local changes) instead of resolving a published npm version. Used inside this monorepo — see `adapter-tester.config.json` in this package.
- `isSourceOfTruthAdapter` — set `true` only in the source-of-truth adapter's own config (`@recursica/mantine-adapter`). Skips `sourceOfTruth`/the divergence check entirely; runs the own-drift check standalone. Also disables Dev Mode (`--serve`) — there's nothing to sync against.
- `diffThresholdPixels`/`storyThresholds`/`excludeTitlePrefixes`/`excludeStoryIds` — same meaning as before; see `src/adapter-tester.schema.json` for full docs.

---

## Using this package in another adapter repo

`@recursica/adapter-tester` is a real, installable devDependency — a standalone adapter repo (not checked out inside this monorepo) can use it to diff its own Storybook against Mantine, Recursica's source-of-truth adapter, without cloning this monorepo at all.

```bash
npm install --save-dev @recursica/adapter-tester @playwright/test
npx playwright install chromium
```

If your repo already has a `storybook` npm script with a port set (`storybook dev -p 6006`), no config file is required. Add the two scripts from [npm scripts](#npm-scripts) above to your `package.json`, then:

```bash
npm run adapter-tester              # Interactive Dev Mode
npm run adapter-tester:automated    # headless Playwright suite
```

Any extra args after `adapter-tester:automated` are passed straight through to `playwright test`, so you can scope a run instead of executing the full suite:

```bash
npm run adapter-tester:automated -- --grep "Toast"
```

Add `adapter-tester.config.json` only to override defaults (see [Configuring `adapter-tester.config.json`](#configuring-adapter-testerconfigjson) above), e.g. to raise the diff threshold or relax specific stories. Add `.adapter-tester/` to your `.gitignore` — it's regenerated on every run. Commit `test/golden/` — that's your project's actual baseline, not a build artifact.
