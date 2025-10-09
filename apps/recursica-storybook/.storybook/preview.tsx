import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider, Themes } from "@recursica/ui-kit-mantine";
import "@recursica/ui-kit-mantine/style.css";
import "@mantine/dates/styles.css";
import "@recursica/official-release/recursica.css";
import "@recursica/official-release/recursica-tokens.css";
import "@recursica/official-release/recursicabrand-light-theme.css";
import "@recursica/official-release/recursicabrand-dark-theme.css";

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
      default: "Light",
      values: [
        { name: "light", value: "Light" },
        { name: "dark", value: "Dark" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      useEffect(() => {
        // Add recursica class to the root element
        const rootElement = document.documentElement;

        // Remove existing theme classes
        rootElement.classList.remove(
          "recursicabrand-dark-theme",
          "recursicabrand-light-theme",
        );

        // Apply theme class based on context.globals?.theme
        const themeName = context.globals?.theme || "light";
        const themeClass =
          themeName === "Dark"
            ? "recursicabrand-dark-theme"
            : "recursicabrand-light-theme";

        if (!rootElement.classList.contains(themeClass)) {
          rootElement.classList.add(themeClass);
        }
      }, [context.globals?.theme]);
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
      defaultValue: "Light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "Light", title: "Light" },
          { value: "Dark", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
