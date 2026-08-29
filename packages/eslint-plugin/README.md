# eslint-plugin-recursica

ESLint plugin enforcing Recursica design-system conventions in applications that consume the Recursica adapters.

## Installation

```bash
npm install --save-dev eslint-plugin-recursica
```

## Usage

Flat config (`eslint.config.js`):

```js
import recursica from "eslint-plugin-recursica";

export default [
  {
    plugins: { recursica },
    rules: {
      "recursica/no-over-styled": "error",
    },
  },
];
```

Or use the recommended config directly:

```js
import recursica from "eslint-plugin-recursica";

export default [recursica.configs.recommended];
```

## Rules

| Rule             | Description                                                           | Recommended |
| ---------------- | --------------------------------------------------------------------- | ----------- |
| `no-over-styled` | Disallows the `overStyled` escape-hatch prop on Recursica components. | `error`     |

`no-over-styled` is a plain ESLint rule — set it to `"warn"` in your own config to downgrade it from the default `"error"`.
