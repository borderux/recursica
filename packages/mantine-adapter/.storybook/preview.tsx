import { createPreviewConfig } from "@recursica/storybook-template";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { MantineProvider, createTheme } from "@mantine/core";
import { recursicaBundle } from "@recursica/official-release/recursica-bundle";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@recursica/official-release/recursica.css";
import "@recursica/official-release/recursicabrand-light-theme.css";
import "@recursica/official-release/recursicabrand-dark-theme.css";
// import "../dist/mantine-adapter.css";
// import "../src/index.css";

// Create Mantine theme
const theme = createTheme({});

const preview = createPreviewConfig({
  defaultTheme: "light",
  enableProvider: true,
  Provider: MantineProvider,
  providerProps: { theme },
  enableThemeProvider: true,
  ThemeProvider: ThemeProvider,
  lightThemeClass: "recursicabrand-light-theme",
  darkThemeClass: "recursicabrand-dark-theme",
  recursicaBundle, // Pass the recursica bundle to preview config
  customParameters: {
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
  },
});

export default preview;
