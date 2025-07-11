import React from "react";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { Themes } from "../src/recursica/RecursicaRecursicaThemes.css";
import "../src/index.css";
import "@mantine/dates/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#18181B" },
        { name: "light", value: "#FFFFFF" },
      ],
    },
    theme: {
      // Custom parameter for docs, not used by Storybook itself
      default: "dark",
      values: [
        { name: "dark", value: Themes.Default.Dark },
        { name: "light", value: Themes.Default.Light },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      // Try to get the theme from the context.globals or parameters
      // Fallback to "dark" if not set
      const themeName =
        context.globals?.theme || context.parameters?.theme?.default || "dark";
      const themeClassname =
        themeName === "light" ? Themes.Default.Light : Themes.Default.Dark;

      return (
        <ThemeProvider themeClassname={themeClassname}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
