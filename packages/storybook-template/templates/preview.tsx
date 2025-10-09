import { createPreviewConfig } from "@recursica/storybook-template";
// Import your UI framework provider (e.g., Mantine, MUI, Chakra, etc.)
// import { MantineProvider } from "@mantine/core";
// import { ThemeProvider } from "@mui/material/styles";

const preview = createPreviewConfig({
  defaultTheme: "dark", // or "light"
  enableProvider: false, // Set to true if you have a UI framework provider
  // Provider: MantineProvider, // Uncomment and replace with your provider
  // providerProps: {}, // Props to pass to your provider
  enableThemeProvider: false, // Set to true if you have a custom theme provider
  // ThemeProvider: ThemeProvider, // Uncomment if using custom theme provider
  // lightThemeClass: "light-theme", // Customize theme class names
  // darkThemeClass: "dark-theme",
  // Add any custom parameters
  // customParameters: {
  //   // Your custom parameters here
  // },
});

export default preview;
