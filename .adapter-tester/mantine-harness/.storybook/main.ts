import { createMainConfig } from "@recursica/storybook-template/main";

const config = createMainConfig({
  stories: [
    "../node_modules/@recursica/mantine-adapter/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  enableCORS: true,
});

// react-docgen-typescript can't resolve a TS project for a config file living
// in .storybook/ when the component source it's docgen'ing lives three
// directories down inside node_modules — it throws "Cannot read properties
// of undefined (reading 'fileExists')", which surfaces as a plain 404 on
// preview.tsx. Docgen only powers Storybook's Controls/Docs tables, which
// this harness never renders, so disabling it is a safe workaround (see
// PROPOSAL-installed-package-harness.md, gap 3).
config.typescript = { ...config.typescript, reactDocgen: false };

export default config;
