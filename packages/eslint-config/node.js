import globals from "globals";

/**
 * A shared ESLint configuration for Node.js scripts.
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
