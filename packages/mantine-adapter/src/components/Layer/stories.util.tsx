import type { ArgTypes } from "@storybook/react";

export const LAYER_ARG_TYPES: ArgTypes = {
  Layer: {
    control: { type: "select" },
    options: [
      "layer-0",
      "layer-1",
      "layer-2",
      "layer-3",
      "layer-alternative-alert",
      "layer-alternative-warning",
      "layer-alternative-primary-color",
      "layer-alternative-high-contrast",
    ],
    description: "The Recursica layer to apply (0-3)",
    defaultValue: "layer-0",
  },
};
