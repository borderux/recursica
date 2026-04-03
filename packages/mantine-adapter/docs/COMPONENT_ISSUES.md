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
