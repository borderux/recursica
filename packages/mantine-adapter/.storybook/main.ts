import { createMainConfig } from "@recursica/storybook-template";

const config = createMainConfig({
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Shared stories are automatically included by createMainConfig
  ],
  basePath: "./", // For GitHub Pages deployment and pr-preview feature
  enableCORS: true, // For iframe embedding and headers file copying
});

export default config;
