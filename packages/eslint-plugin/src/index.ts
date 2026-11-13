import type { TSESLint } from "@typescript-eslint/utils";
import { noOverStyled } from "./rules/no-over-styled.js";

export const rules = {
  "no-over-styled": noOverStyled,
};

const plugin = {
  rules,
  configs: {} as Record<"recommended", TSESLint.FlatConfig.Config>,
};

// Flat config; references the plugin object itself, so it's assigned after creation.
plugin.configs.recommended = {
  plugins: { recursica: plugin },
  rules: {
    "recursica/no-over-styled": "error",
  },
};

export const configs = plugin.configs;

export default plugin;
