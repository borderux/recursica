import { createMainConfig } from "@recursica/storybook-template";
import { recursicaBundle } from "@recursica/official-release/recursica-bundle";

const config = createMainConfig({
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Shared stories are automatically included by createMainConfig
  ],
  recursicaBundle, // Pass the recursica bundle directly
  basePath: "/recursica/", // For GitHub Pages deployment
  enableCORS: true, // For iframe embedding
  copyHeadersFile: true, // For GitHub Pages headers
});

export default config;
