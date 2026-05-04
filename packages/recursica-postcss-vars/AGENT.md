# AGENT.md — @recursica/recursica-postcss-vars

This package is a PostCSS plugin that validates CSS variables used in stylesheets against a known CSS source of truth at build time.

## Purpose

Ensures that any `var(--recursica_...)` reference in your CSS actually exists in the compiled Recursica variables file. If a variable is missing or renamed, the plugin emits a warning (or halts the build in strict mode).

## Configuration

The plugin is configured in the consumer's `postcss.config.js`:

```js
module.exports = {
  plugins: {
    "@recursica/recursica-postcss-vars": {
      cssPath: "./path/to/recursica_variables_scoped.css",
      strict: process.env.NODE_ENV === "production",
    },
  },
};
```

## Options

- `cssPath` (required) — Path to the source-of-truth CSS file containing `--recursica_*` variable declarations.
- `strict` (optional, default `false`) — `false` = console warning; `true` = `process.exit(1)` build failure.

## Guidelines

- This plugin should only validate variables — it must not transform or modify CSS.
- The `strict` mode is intended for CI/production builds; keep `false` as default for dev.
