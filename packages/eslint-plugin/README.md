# @recursica/eslint-plugin

ESLint plugin enforcing Recursica design-system conventions in applications that consume the Recursica adapters.

## Installation

```bash
npm install --save-dev @recursica/eslint-plugin
```

## Usage

Flat config (`eslint.config.js`). The plugin is the default export; register it under any key (below, `recursica`) and use that key as the rule prefix:

```js
import recursica from "@recursica/eslint-plugin";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { recursica },
    rules: {
      "recursica/no-over-styled": "error",
    },
  },
];
```

The rule inspects JSX, so the files it runs on must be parsed with a JSX-capable parser (as above, or your project's existing TypeScript/React ESLint setup).

Or use the recommended flat config, which registers the plugin as `recursica` and enables its rules:

```js
export default [
  // ...parser setup as above
  { files: ["**/*.{jsx,tsx}"], ...recursica.configs.recommended },
];
```

The plugin only supports flat config, and works with ESLint 8.57+, 9 and 10.

## Rules

| Rule             | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| `no-over-styled` | Disallows the `overStyled` escape-hatch prop on Recursica components. |

`no-over-styled` is a plain ESLint rule — set it to `"warn"` in your own config to downgrade it from `"error"`.
