// ESLint configuration for recursica-storybook app
import storybook from "eslint-plugin-storybook";
import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      // Suppress unused eslint-disable directive warnings
      "no-restricted-syntax": "off",
      "eslint-disable": "off",
      "eslint-disable-next-line": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
];
