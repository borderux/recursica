import type { Parameters } from "@storybook/react-vite";

export const backgroundParameters: Parameters = {
  backgrounds: {
    default: "dark",
    values: [
      { name: "dark", value: "#18181B" },
      { name: "light", value: "#FFFFFF" },
    ],
  },
};

export const lightBackgroundParameters: Parameters = {
  backgrounds: {
    default: "light",
    values: [
      { name: "light", value: "#FFFFFF" },
      { name: "dark", value: "#18181B" },
    ],
  },
};
