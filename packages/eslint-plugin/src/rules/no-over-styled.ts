import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator.withoutDocs;

export const noOverStyled = createRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow the `overStyled` escape-hatch prop on Recursica components.",
    },
    schema: [],
    messages: {
      noOverStyled:
        "`overStyled` bypasses Recursica's design-token sandboxing and should only exist as short-term technical debt (see OVERSTYLING.md). Remove it or refactor to use a supported Recursica variant/prop instead.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "overStyled"
        ) {
          context.report({ node, messageId: "noOverStyled" });
        }
      },
    };
  },
});
