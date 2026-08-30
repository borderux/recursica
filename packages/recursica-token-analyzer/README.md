# @recursica/token-analyzer

A lightweight, blazing-fast CLI tool designed to enforce strict parity between Recursica design tokens and React adapter components (`@recursica/mantine-adapter`, `@recursica/mui-adapter`, etc.).

## What it does

The token analyzer statically parses the auto-generated `recursica_variables_scoped.css` file and compares it against your component source code (`.tsx`, `.ts`, `.module.css`) to find:

1. **Broken Variables**: Variables that your components are trying to use, but no longer exist in the Figma UI Kit.
2. **Unused Variables**: Variables that exist in the UI Kit for your component, but have not yet been implemented in your React code (e.g. new features, new states).
3. **Layer Violations**: Component CSS reaching past the `--recursica_ui-kit_components_*` layer into the raw `--recursica_brand_*`/`--recursica_tokens_*` layers without an explicit, declared reason. See "Layer Enforcement" below.

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

If the analyzer finds **ANY broken variables** (variables your code references that no longer exist in the UI Kit) **or ANY layer violations** (unexempted `--recursica_brand_*`/`--recursica_tokens_*` usage — see "Layer Enforcement" below), it will exit with a `1` status code and **instantly fail the build.**

Unused variables — including un-exempted ones — never fail the build on their own; they're reported as warnings in the console and in `token-analysis.json` so you can track and address them on your own schedule.

## Layer Enforcement (`recursica-allow-brand`)

Components must only reference the generic `--recursica_ui-kit_components_*` layer. The raw
`--recursica_brand_*` and `--recursica_tokens_*` layers sit underneath that and are not meant to
be touched by component code directly — they resolve down through the ui-kit layer instead. The
analyzer enforces this as a hard rule on every `.module.css` file, separate from (and stricter
than) the unused-variable warnings above:

- **`--recursica_tokens_*` is never allowed**, no exceptions. Any direct reference is a build
  failure.
- **`--recursica_brand_*` requires an explicit exemption** declared in that same file's own
  header (before the first CSS rule), naming the exact variable:

  ```css
  /* recursica-allow-brand: --recursica_brand_states_hover_color */
  ```

  Any `--recursica_brand_*` reference not covered by a matching directive in the file's header is
  a build failure. Add one `recursica-allow-brand:` line per variable, with a short comment above
  explaining why the component needs to reach past the ui-kit layer (see any of Button, Chip,
  DatePicker, etc. for examples — most are the global hover/focus/disabled state tokens).

Violations are reported the same way as broken variables: printed to the console, written to
`layerViolations` in the JSON report, and the process exits with status `1`.

Raw `--recursica_brand_*`/`--recursica_tokens_*` variables are also excluded entirely from the
Unused Variables count below — components are architecturally never supposed to consume them
directly, so they'd otherwise always read as "unused" regardless of how complete a component is.

## The Exemption System (`recursica-ignore`)

The analyzer will warn on unused variables — e.g. if the design team adds a variable to Figma that you haven't implemented yet, or exports a redundant variable you don't need — but this never fails the build on its own.

If there is a variable that you purposely want to ignore and have no intention of implementing, you can exempt it directly inside the CSS file where it belongs, keeping the warning noise down.

Simply add a special `recursica-ignore:` comment block anywhere in your `.module.css` file:

```css
/* recursica-ignore: --recursica_ui-kit_components_button_some_weird_state_we_dont_want */
```

The analyzer will scan your component files, extract these ignore directives, and completely exclude them from the Unused Variables calculations.

### Stale Exemptions

Exemptions themselves can go stale: if the design team later removes or renames the variable a `recursica-ignore:` directive points to, that directive is now exempting nothing and is just dead weight in the CSS file.

The analyzer detects these automatically and reports them as `staleExemptions` (distinct from `unusedByComponent`—a stale exemption's variable doesn't exist in the UI Kit at all, it isn't just unimplemented). Run with `--cleanup` to have the analyzer remove the stale `recursica-ignore:` comment lines from your source files directly:

```bash
analyze-tokens --cleanup
```

`--cleanup` only ever removes directives confirmed stale by this run; it never touches exemptions for variables that still exist but are simply unused.

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
