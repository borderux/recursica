import type { Parameters } from "@storybook/react-vite";

export const commonParameters: Parameters = {
  options: {
    storySort: {
      order: [
        "Introduction",
        "Tokens",
        ["Tokens/Colors", "Tokens/Grid", "Tokens/Size"],
        "Components",
        "*",
      ],
    },
  },
};
