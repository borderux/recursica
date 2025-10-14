import { createMainConfig } from "@recursica/storybook-template";

const config = createMainConfig({
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Shared stories are automatically included by createMainConfig
  ],
  basePath: "/storybook/", // For GitHub Pages deployment
  enableCORS: true, // For iframe embedding and headers file copying
});

export default config;
