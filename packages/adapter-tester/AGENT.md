# AI Agent Execution Guidelines: @recursica/adapter-tester

This document serves as a guideline for any AI agent interacting with the visual regression tester. It defines how we test, what constitutes a failure, and how to handle acceptable differences between an adapter and `@recursica/mantine-adapter`, the source of truth.

## 1. Core Philosophy

Our goal is **visual and token synchronization**, not perfect structural parity.
Because the underlying UI library of an adapter can generate different raw HTML nodes (e.g., `span` vs `div`) and use different internal wrappers than Mantine, a direct JSON comparison of their DOM trees will almost always fail.
Your objective is to ensure that Recursica's custom CSS variables, layouts, and typographies are correctly inherited and applied to the adapter so it _looks_ identical to the Mantine source of truth.

## 2. Running the Tests

- **Run all components against their golden images**: `npm run adapter-tester:automated`
- **Reviewing Output**: The test automatically compiles a comprehensive, fully styled HTML report. You can review all screenshots, visual diff highlights, and source-of-truth divergence flags by opening the standard `playwright-report/index.html` file in a browser.
- These are developer-run workflows, not CI checks — scope with `--grep` rather than always running the full suite.

### Test Directory and Output Standard

- **CRITICAL FOLDER RULE**: You must exclusively use standard, configured folders for test artifacts. Do **NOT** create or invent new output directories (such as `diffs` or custom result folders).
- All visual assets and attachments must be written directly as native Playwright test attachments.
- The standard, git-ignored directories are:
  1. `playwright-report/`: Contains the interactive HTML report (`index.html`).
  2. `test-results/`: Contains raw screenshot buffers and difference highlights generated during test runs.
- `test/golden/` (per adapter) is **not** git-ignored — it's the committed baseline, not a build artifact. See §5.

## 3. Defining "Close Enough"

While we strive for 0 mismatched pixels, pixel-perfect alignment is often impossible due to sub-pixel rendering, font anti-aliasing differences, or hardcoded library paddings.

A component is considered "Close Enough" and passing if:

1. The Recursica design tokens (colors, radii, font-sizes) are definitively mapped to the correct CSS slots.
2. The user experience and interaction states (hover, focus, disabled) are aligned.
3. The remaining pixel differences are solely due to rendering engine nuances (e.g., anti-aliasing) or minor layout engine shifts.

### Thresholds

- The global visual diff threshold is the `diffThresholdPixels` field in the consuming project's `adapter-tester.config.json`, or this package's own `adapter-tester.config.json` for the monorepo/non-standard mode.
- **⚠️ AI AGENT GUARDRAIL**: Under no circumstances are AI agents allowed to modify `diffThresholdPixels` in any `adapter-tester.config.json`. Only human developers are permitted to alter this global threshold. Bypassing this threshold by editing the file is an automatic failure.
- If a test fails this threshold, it is almost certainly a genuine CSS mapping bug that must be investigated and fixed in the adapter styling code itself.

## 4. Handling Acceptable Exemptions

When you encounter an unfixable or acceptable difference that exceeds the global threshold and cannot be resolved through code styling fixes:

1. **Document It**: Explain exactly _why_ the difference exists (e.g., "the underlying library forces a non-removable wrapper div that shifts the baseline by 1px") when you propose the change.
2. **Increase Threshold for Specific Case**: If necessary and explicitly permitted by the developer, add the story's id prefix to `storyThresholds` with its own threshold in the same `adapter-tester.config.json`. Do not alter the global `diffThresholdPixels`.
3. **Skip a Story Entirely**: If a story has no meaningful cross-adapter counterpart to diff (and only if explicitly permitted by the developer), add its id prefix to `excludeStoryIds` instead of relaxing its threshold.
4. **Notify User**: Inform the user of the exemption and the reasoning behind it during your summary.

## 5. Golden Images

`test/golden/<story-id>.png` + `manifest.json` are the committed baseline every automated run checks against — not test output, and not something to regenerate casually.

- **⚠️ AI AGENT GUARDRAIL**: Do not run `--update-golden` or `--approve-divergence`, and do not hand-edit any file under `test/golden/` (including `manifest.json`), without the developer explicitly asking for that specific action in that moment. Both actions redefine what "correct" means going forward — an agent silently doing either defeats the review the golden-image model exists for.
- A missing golden for a new story is captured automatically by a normal (no-flag) run — that's expected, not something requiring permission.
- `manifest.json` is schema-validated (`src/golden/manifest.schema.json`) on every read/write; don't construct or edit it by hand even when explicitly asked to update a baseline — use `--update-golden`/`--approve-divergence` so timestamps and structure stay correct.
