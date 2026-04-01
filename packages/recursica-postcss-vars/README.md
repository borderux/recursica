# @recursica/recursica-postcss-vars

A PostCSS plugin that validates CSS variables used in your stylesheets against a known CSS source of truth. If a variable is missing or renamed in the imported variables file, this plugin will throw a compilation warning at build-time.

## Installation

```bash
npm install @recursica/recursica-postcss-vars --save-dev
```

## Setup

Include the plugin in your `postcss.config.js` and provide the absolute or relative path to your CSS definitions file (e.g. `recursica_variables_scoped.css`).

```javascript
module.exports = {
  plugins: {
    "@recursica/recursica-postcss-vars": {
      cssPath: "./path/to/recursica_variables_scoped.css",
      strict: process.env.NODE_ENV === "production", // Optional. Defaults to false.
    },
  },
};
```

## Options

### `cssPath` (required)

The absolute or relative path to your compiled source-of-truth CSS file that contains your available variable declarations (`--recursica_...`).

### `strict` (optional)

Boolean toggle to control how errors are surfaced. Defaults to `false`.

- **`false`**: Emits a non-blocking `⚠️ WARNING:` to the console. Great for development servers where you don't want the UI reloading abruptly.
- **`true`**: Instantly halts the build process with a `❌ BUILD FAILED` crash using `process.exit(1)`. Ideal for CI/CD or production configurations.

The plugin will run over all loaded CSS and warn you in the build terminal if a `var(--xyz)` variable appears but isn't defined inside `recursica_variables_scoped.css`.
