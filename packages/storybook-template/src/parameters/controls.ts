import type { Parameters } from "@storybook/react-vite";

export const controlParameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};
