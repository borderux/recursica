# @recursica/token-analyzer

A lightweight, blazing-fast CLI tool designed to enforce strict parity between Figma UI Kit design tokens and React adapter components (`@recursica/mantine-adapter`, `@recursica/mui-adapter`, etc.).

## What it does

The token analyzer statically parses the auto-generated `recursica_variables_scoped.css` file and compares it against your component source code (`.tsx`, `.ts`, `.module.css`) to find:

1. **Broken Variables**: Variables that your components are trying to use, but no longer exist in the Figma UI Kit.
2. **Unused Variables**: Variables that exist in the UI Kit for your component, but have not yet been implemented in your React code (e.g. new features, new states).

The tool automatically generates a `token-analysis.json` file in your adapter's root directory. This JSON uses a relational schema indexing all your components, making it incredibly easy for developers and AI agents to quickly identify which CSS files need to be updated.

> **Note on Themes:** The analyzer automatically filters out all `_themes_` and `_brand_themes_` specific layer variables. As mandated by the UI Kit documentation, components should only ever consume the base "generic" variables.

## Usage

This package is designed to be run from within an adapter package directory.

### 1. Manual Execution

When you receive a new version of the UI kit, run the analyzer manually to see what broke or what new features need to be built:

```bash
npm run analyze-tokens
```

_(This runs `analyze-tokens --css recursica_variables_scoped.css --dir src/components --output token-analysis.json`)_

### 2. CI / Build Integration (Ultra-Strict Mode)

The analyzer is deeply integrated into the adapter build pipelines. It runs automatically during the `prebuild` hook.

If the analyzer finds **ANY broken variables** or **ANY un-exempted unused variables**, it will exit with a `1` status code and **instantly fail the build.**

## The Exemption System (`recursica-ignore`)

Because the analyzer is ultra-strict, it will fail your build if the design team adds a variable to Figma that you haven't implemented yet, or if they export a redundant variable you don't need.

If there is a variable that you purposely want to ignore and have no intention of implementing, you can exempt it directly inside the CSS file where it belongs!

Simply add a special `recursica-ignore:` comment block anywhere in your `.module.css` file:

```css
/* recursica-ignore: --recursica_ui-kit_components_button_some_weird_state_we_dont_want */
```

The analyzer will scan your component files, extract these ignore directives, and completely exclude them from the Unused Variables calculations—allowing your build to pass!

## JSON Report Schema

The generated `token-analysis.json` uses a relational schema. It starts with a master index of all your components:

```json
"components": {
  "button": {
    "name": "Button",
    "tokenPrefix": "button",
    "directory": "src/components/Button",
    "files": [
      "src/components/Button/Button.tsx",
      "src/components/Button/Button.module.css"
    ]
  }
}
```

The rest of the report (`brokenComponents`, `missingVariables`, `unusedByComponent`) uses the lowercase component ID (e.g., `"button"`) so you can easily trace the missing tokens back to the exact source files that need fixing.
