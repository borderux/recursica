# Component Issues and Open Questions

This document tracks known issues, edge cases, missing variables, or design system concerns mapped by component. It acts as a running ledger for developers and designers to align on what needs to be fixed or updated in the Figma token variables or component logic.

## Badge

### 1. Missing Size Variants

- **Description:** Currently, the CSS variables define padding, text size, and line height globally for the component (e.g. `--recursica_ui-kit_components_badge_properties_padding-horizontal`). There are no `size` variants (`xs`, `sm`, `md`, `lg`, etc.).
- **Impact:** We cannot natively support multiple sizes via styling tokens.
- **Current Resolution:** We restrict the component to a single size and have omitted the `size` prop from the underlying Mantine integration.

### 2. Variants act as Color Intents (No Visual Styles)

- **Description:** Our defined styles (`alert`, `primary-color`, `success`, `warning`) map more accurately to intents rather than visual styles (like `solid`, `outline`, or `subtle`).
- **Impact:** You cannot request an "outlined success badge". The styling tokens are heavily coupled to one specific visualization.
- **Current Resolution:** Intended behavior per Recursica for now, but documented here as a limitation compared to underlying UI library capabilities.

## Breadcrumb

### 1. Missing View Variants and Sizes

- **Description:** Currently, the CSS variables define basic spacing properties (`padding`, `item-gap`) globally for the component. There are no `size` or structural `variant` values defined in `recursica_ui-kit.json`.
- **Impact:** The component is restricted to a single default visual layout with no native options for resizing or visual variations (e.g. outline styling).
- **Current Resolution:** We restrict the component to rendering the single token-driven style. Developers must use standard CSS `fontSize` cascading for text adjustments if needed until variables are implemented.
