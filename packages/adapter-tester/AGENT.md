# AI Agent Execution Guidelines: @recursica/adapter-tester

This document serves as a guideline for any AI agent interacting with the visual regression tester. It defines how we test, what constitutes a failure, and how to handle acceptable differences between the `@recursica/mui-adapter` and `@recursica/mantine-adapter`.

## 1. Core Philosophy

Our goal is **visual and token synchronization**, not perfect structural parity.
Because the Mantine and Material-UI underlying libraries generate different raw HTML nodes (e.g., `span` vs `div`) and use different internal wrappers, a direct JSON comparison of their DOM trees will almost always fail.
Your objective is to ensure that Recursica's custom CSS variables, layouts, and typographies are correctly inherited and applied to the MUI adapter so it _looks_ identical to the Mantine source of truth.

## 2. Running the Tests

- **Run all components in headless visual regression**: `npm run test:visual`
- **Reviewing Output**: The test automatically compiles a comprehensive, fully styled HTML report. You can review all side-by-side screenshots, visual diff highlights, and DOM JSON tree files by opening the standard `playwright-report/index.html` file in a browser.

### Test Directory and Output Standard

- **CRITICAL FOLDER RULE**: You must exclusively use standard, configured folders for test artifacts. Do **NOT** create or invent new output directories (such as `diffs` or custom result folders).
- All visual assets, attachments, and DOM comparisons must be written directly as native Playwright test attachments.
- The standard, git-ignored directories are:
  1. `playwright-report/`: Contains the interactive HTML report (`index.html`).
  2. `test-results/`: Contains raw screenshot buffers and difference highlights generated during test runs.

## 3. Defining "Close Enough"

While we strive for 0 mismatched pixels, pixel-perfect alignment is often impossible due to sub-pixel rendering, font anti-aliasing differences, or hardcoded library paddings.

A component is considered "Close Enough" and passing if:

1. The Recursica design tokens (colors, radii, font-sizes) are definitively mapped to the correct CSS slots.
2. The user experience and interaction states (hover, focus, disabled) are aligned.
3. The remaining pixel differences are solely due to rendering engine nuances (e.g., anti-aliasing) or minor layout engine shifts.

### Thresholds

- The global visual diff threshold is defined in `tests/config.ts` as `VISUAL_DIFF_THRESHOLD_PIXELS`.
- **⚠️ AI AGENT GUARDRAIL**: Under no circumstances are AI agents allowed to modify the global `VISUAL_DIFF_THRESHOLD_PIXELS` in `tests/config.ts`. Only human developers are permitted to alter this global threshold. Bypassing this threshold by altering the file is an automatic failure.
- If a test fails this threshold, it is almost certainly a genuine CSS mapping bug that must be investigated and fixed in the adapter styling code itself.

## 4. Handling Acceptable Exemptions

When you encounter an unfixable or acceptable difference that exceeds the global threshold and cannot be resolved through code styling fixes:

1. **Document It**: Add a comment directly above the `expect.soft(diffPixels).toBeLessThan(X);` assertion in the `visual-regression.spec.ts` file explaining exactly _why_ the difference exists (e.g., "MUI forces a non-removable wrapper div that shifts the baseline by 1px").
2. **Increase Threshold for Specific Case**: If necessary and explicitly permitted by the developer, you may use a local hardcoded threshold override inside that specific test block using a localized expectation. Do not alter the global `config.ts` threshold.
3. **Notify User**: Inform the user of the exemption and the reasoning behind it during your summary.
