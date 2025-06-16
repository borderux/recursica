import { config as baseConfig } from "@repo/eslint-config/base";
import { config as nodeConfig } from "@repo/eslint-config/node";

/** @type {import("eslint").Linter.Config[]} */
const customConfig = [
  ...baseConfig,
  {
    files: ["scripts/**/*.js"],
    ...nodeConfig[0],
  },
];

export default customConfig;
