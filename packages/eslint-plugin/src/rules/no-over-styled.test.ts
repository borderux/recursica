import { RuleTester } from "@typescript-eslint/rule-tester";
import { noOverStyled } from "./no-over-styled.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-over-styled", noOverStyled, {
  valid: [
    "<Button>Click</Button>;",
    '<Button variant="filled">Click</Button>;',
    // `overStyled` used as an unrelated identifier, not a JSX attribute
    "const overStyled = true;",
  ],
  invalid: [
    {
      code: "<Button overStyled>Click</Button>;",
      errors: [{ messageId: "noOverStyled" }],
    },
    {
      code: '<Button overStyled={true} bg="pink">Click</Button>;',
      errors: [{ messageId: "noOverStyled" }],
    },
    {
      code: "<Button overStyled={false}>Click</Button>;",
      errors: [{ messageId: "noOverStyled" }],
    },
  ],
});
