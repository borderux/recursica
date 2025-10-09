import type { Parameters } from "@storybook/react-vite";

export const accessibilityParameters: Parameters = {
  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: "todo",
  },
};
