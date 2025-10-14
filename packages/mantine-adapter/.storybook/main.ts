import { createMainConfig } from "@recursica/storybook-template";

// Determine base path based on deployment context
// For PR previews, we need to use relative path, for main deployment use /storybook/
const getBasePath = () => {
  // Check if this is a PR preview build (set by the PR preview workflow)
  if (process.env.VITE_STORYBOOK_PR_PREVIEW === "true") {
    return "./"; // Use relative path for PR previews
  }
  // For main deployment, use /storybook/
  return "/storybook/";
};

const config = createMainConfig({
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Shared stories are automatically included by createMainConfig
  ],
  basePath: getBasePath(), // Dynamic base path for different deployment contexts
  enableCORS: true, // For iframe embedding and headers file copying
});

export default config;
