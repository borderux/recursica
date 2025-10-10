import { createMainConfig } from "@recursica/storybook-template";

const config = createMainConfig({
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Shared stories are automatically included by createMainConfig
  ],
  basePath: "/recursica/", // For GitHub Pages deployment
  enableCORS: true, // For iframe embedding
  copyHeadersFile: true, // For GitHub Pages headers
});

export default config;
