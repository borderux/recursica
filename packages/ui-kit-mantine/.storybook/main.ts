import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Configure for GitHub Pages subpath deployment
  viteFinal: async (config) => {
    // Set base path for GitHub Pages
    config.base =
      process.env.NODE_ENV === "production" ? "/ui-kit-mantine/" : "/";

    return config;
  },
};
export default config;
