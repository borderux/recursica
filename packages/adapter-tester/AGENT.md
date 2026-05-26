# AI Agent Execution Guidelines: @recursica/adapter-tester

This document serves as a guideline for any AI agent interacting with the visual regression tester. It defines how we test, what constitutes a failure, and how to handle acceptable differences between the `@recursica/mui-adapter` and `@recursica/mantine-adapter`.

## 1. Core Philosophy

Our goal is **visual and token synchronization**, not perfect structural parity.
Because the Mantine and Material-UI underlying libraries generate different raw HTML nodes (e.g., `span` vs `div`) and use different internal wrappers, a direct JSON comparison of their DOM trees will almost always fail.
Your objective is to ensure that Recursica's custom CSS variables, layouts, and typographies are correctly inherited and applied to the MUI adapter so it _looks_ identical to the Mantine source of truth.

## 2. Running the Tests

- **Run all components**: `npm run test`
- **Run a specific component**: `npm run test -- <ComponentName>` (e.g., `npm run test -- Slider`)
- **Reviewing Output**: The test will attach a JSON dump of the extracted DOM/CSS styles and the pixel diff screenshots directly to the Playwright report. View this report using the link provided in the terminal output.

## 3. Defining "Close Enough"

While we strive for 0 mismatched pixels, pixel-perfect alignment is often impossible due to sub-pixel rendering, font anti-aliasing differences, or hardcoded library paddings.

A component is considered "Close Enough" and passing if:

1. The Recursica design tokens (colors, radii, font-sizes) are definitively mapped to the correct CSS slots.
2. The user experience and interaction states (hover, focus, disabled) are aligned.
3. The remaining pixel differences are solely due to rendering engine nuances (e.g., anti-aliasing) or minor layout engine shifts.

### Thresholds

- The global visual diff threshold is defined in `tests/config.ts` as `VISUAL_DIFF_THRESHOLD_PIXELS`.
- **CRITICAL**: This threshold is a global configuration value meant to account for standard Storybook engine differences (e.g., `<CssBaseline>` font rendering). It should **NOT** be changed on a per-test basis. If a test fails this threshold, it is almost certainly a genuine CSS mapping bug that must be fixed.

## 4. Handling Acceptable Exemptions

When you encounter an unfixable or acceptable difference:

1. **Document It**: Add a comment directly above the `expect.soft(diffPixels).toBeLessThan(X);` assertion in the component's `.spec.ts` file explaining exactly _why_ the difference exists (e.g., "MUI forces a non-removable wrapper div that shifts the baseline by 1px").
2. **Increase Threshold**: Bump the pixel threshold for that specific assertion to cleanly pass the test.
3. **Notify User**: Inform the user of the exemption and the reasoning behind it during your summary.
