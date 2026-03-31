# UI Kit Mantine - Agent Instructions

## Purpose

The purpose of this package is to create a Recursica component library that wraps Mantine's components.

The primary goal of this adapter is to create a set of Recursica components that directly apply the Recursica CSS variables to Mantine components to prevent them from being overridden.

It should **not** change the underlying Mantine styles or theme, as that aspect can and should be managed by the end user of the package.

## Component Implementation Guides

When implementing Recursica components and exporting them from this package, you must strictly follow these provided guides:

1. **Component Implementation Walkthrough**: `docs/COMPONENT_GUIDE_WALKTHROUGH.md`
2. **Component Storybook Guide**: `docs/COMPONENT_STORYBOOK_GUIDE.md`

Please ensure you read and adhere to these documents whenever creating, modifying, or verifying any Mantine wrapper components in this package.

## Recursica Configuration Files

The following Recursica-specific files are located in this package and contain the tokens, theme values, and CSS variables necessary for the components:

- `recursica_brand.json`
- `recursica_tokens.json`
- `recursica_ui-kit.json`
- `recursica_variables_scoped.css`

**Assumption for Integrators:** We must assume that the integrator of this package imports `recursica_variables_scoped.css` into their application. This means our wrapper components should rely directly on the CSS variables defined in that file to ensure the correct Recursica styling is applied.
