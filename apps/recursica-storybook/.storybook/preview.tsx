import React from "react";
import type { Preview } from "@storybook/react-vite";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider, Themes } from "@recursica/ui-kit-mantine";
import "@recursica/ui-kit-mantine/style.css";
import "@mantine/dates/styles.css";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "Tokens",
          ["Colors", "Size", "Grid"],
          "Components",
          "*",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "dark", value: "#18181B" },
      ],
    },
    theme: {
      default: "light",
      values: [
        { name: "light", value: Themes.Default.Light },
        { name: "dark", value: Themes.Default.Dark },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const themeName =
        context.globals?.theme || context.parameters?.theme?.default || "light";
      const themeClassname =
        themeName === "light" ? Themes.Default.Light : Themes.Default.Dark;

      return (
        <MantineProvider>
          <ThemeProvider themeClassname={themeClassname}>
            <Story />
          </ThemeProvider>
        </MantineProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
