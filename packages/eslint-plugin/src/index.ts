import { noOverStyled } from "./rules/no-over-styled.js";

export const rules = {
  "no-over-styled": noOverStyled,
};

export const configs = {
  recommended: {
    plugins: ["recursica"],
    rules: {
      "recursica/no-over-styled": "error",
    },
  },
};

const plugin = {
  rules,
  configs,
};

export default plugin;
