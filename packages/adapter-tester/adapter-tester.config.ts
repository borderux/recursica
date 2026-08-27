import { defineAdapterTesterConfig } from "./src/config";
import { VISUAL_DIFF_THRESHOLD_PIXELS } from "./tests/config";

// This monorepo's own dogfood config: Mantine (source of truth) vs MUI,
// both launched as sibling workspace packages by playwright.config.ts.
//
// A standalone adapter repo installing @recursica/adapter-tester as a
// devDependency instead defines its own config — typically pairing its own
// already-running local Storybook as the non-source-of-truth target with
// `mantineSourceOfTruthWebServer()` (see src/harness/mantineSourceOfTruth.ts)
// as the source-of-truth side, so it never needs this monorepo checked out.
export default defineAdapterTesterConfig({
  targets: [
    { name: "Mantine", url: "http://localhost:6011", sourceOfTruth: true },
    { name: "MUI", url: "http://localhost:6012" },
  ],
  diffThresholdPixels: VISUAL_DIFF_THRESHOLD_PIXELS,
  // Allow higher threshold for components with minor structural layout or
  // rendering variations between libraries.
  relaxedThresholdStoryIds: [
    "ui-kit-checkboxgroup",
    "ui-kit-radiogroup",
    "ui-kit-switchgroup",
    "ui-kit-checkbox",
    "ui-kit-radio",
    "ui-kit-switch",
    "ui-kit-segmentedcontrol",
    "ui-kit-numberinput",
    "ui-kit-slider",
    "ui-kit-textfield",
    "ui-kit-timeline",
    "ui-kit-title",
  ],
  relaxedThresholdPixels: 15000,
});
