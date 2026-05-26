/**
 * adapter-tester/tests/config.ts
 *
 * Global test configuration for visual regression and structural parity checks.
 */

// Due to global Storybook baseline differences (e.g. MUI CssBaseline applies Roboto
// and a different body text color than Mantine), text characters will inherently render
// differently between the two environments, accumulating thousands of mismatched pixels
// due to shape and anti-aliasing.
//
// NOTE: This threshold should NOT be changed on a per-test basis. It is a common
// config value that accounts for acceptable global engine/typography differences across all tests.
//
// ============================================================================
// ⚠️ STRICT GUARDRAIL FOR AI AGENTS:
// DO NOT MODIFY THE THRESHOLD VALUE BELOW. IT IS TO BE CHANGED ONLY BY HUMAN
// DEVELOPERS. AN AI AGENT IS STRICTLY FORBIDDEN FROM MODIFYING THIS VALUE.
// ============================================================================
export const VISUAL_DIFF_THRESHOLD_PIXELS = 3500;
