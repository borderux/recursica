import { config as baseConfig } from "@repo/eslint-config/react-internal";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Add any package-specific rules here
    },
  },
];
