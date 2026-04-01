import { create } from "storybook/theming";

export default create({
  base: "light",

  // Brand information
  brandTitle: "Recursica Design System",
  brandUrl: "https://recursica.com",
  brandTarget: "_self",

  // Typography - using Recursica's font families
  fontBase: '"Lexend", "Inter", system-ui, sans-serif',
  fontCode: '"Quattrocento", "JetBrains Mono", "SF Mono", Consolas, monospace',

  // Primary colors - using Recursica red (mandy/salmon)
  colorPrimary: "#d40d0d", // mandy/500 - Recursica red
  colorSecondary: "#bd0b0b", // mandy/600 - darker red

  // UI colors - clean red, black, white palette
  appBg: "#ffffff", // pure white
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e9e9e9", // gray/100 - very light gray
  appBorderRadius: 8,

  // Text colors - using blacks and grays
  textColor: "#0a0a0a", // gray/1000 - near black
  textInverseColor: "#ffffff",

  // Toolbar colors - red accent with black/white
  barTextColor: "#2c2c2c", // gray/800 - dark gray
  barSelectedColor: "#d40d0d", // mandy/500 - Recursica red
  barHoverColor: "#ec0e0e", // mandy/400 - lighter red
  barBg: "#ffffff",

  // Form colors
  inputBg: "#ffffff",
  inputBorder: "#d6d6d6", // gray/200 - light gray
  inputTextColor: "#0a0a0a", // gray/1000 - near black
  inputBorderRadius: 8,
});
