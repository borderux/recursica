import React from "react";
import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { Themes } from "../src/recursica/RecursicaRecursicaThemes.css";
import "../src/index.css";

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
  },
  decorators: [
    (story) => (
      <ThemeProvider themeClassname={Themes.Default.Light}>
        {story()}
      </ThemeProvider>
    ),
  ],
};

export default preview;
