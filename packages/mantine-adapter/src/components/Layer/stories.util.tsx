import type { ArgTypes } from "@storybook/react";

export const LAYER_ARG_TYPES: ArgTypes = {
  Layer: {
    control: { type: "select" },
    options: ["0", "1", "2", "3"],
    description: "The Recursica layer to apply (0-3)",
    defaultValue: "0",
  },
};
