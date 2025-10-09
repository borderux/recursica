import { createMainConfig } from "@recursica/storybook-template/configs/main";

const config = createMainConfig({
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // Optional: customize base path for deployment
  // basePath: "/your-app/",
  // Optional: enable CORS for iframe embedding
  // enableCORS: true,
  // Optional: copy _headers file for GitHub Pages
  // copyHeadersFile: true,
});

export default config;
