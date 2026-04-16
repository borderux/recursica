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

## Card

### 1. Structural Departure from Generic Mantine Sections

- **Description:** Mantine natively builds generic `Card` structures strictly via a generic `<Card.Section>` wrapper, meaning layout formatting (like headers vs footers) is normally handled manually by developers. Recursica’s UI Kit defines strict explicit tokens for `header-padding`, `footer-background`, etc.
- **Impact:** We cannot allow users to arbitrarily inject standard generic sections without losing sync with the overarching explicitly-targeted UI kit bounds.
- **Current Resolution:** We explicitly export `<Card.Header>` and `<Card.Footer>` wrappers alongside `<Card.Section>` to enforce the strict tokens natively onto Mantine's sections behind the scenes. Developers must use `Card.Header` and `Card.Footer` for structural parity rather than rolling their own generic layout.

## Button

### 1. Omitted `fullWidth` Layout Attribute

- **Description:** Mantine natively supports a `fullWidth` prop on `<Button>` components which mathematically expands the node. Recursica bounds strict dimensional scaling explicitly, leaving dynamic expansion largely governed by flex-container grid parents.
- **Impact:** Developers cannot force buttons to visually stretch 100% width inline natively using component overrides.
- **Current Resolution:** We actively omit `fullWidth` from the native abstract. Developers should wrap components with flex grids or column lists rather than independently stretching boundary layouts.

## Label

### 1. Edit Icon UX Paradigm Ambiguity

- **Description:** The `Label` primitive exposes a `labelWithEditIcon` boolean triggering a visual edit icon to render adjacent to the label text (a concept derived loosely from data-heavy Material UI patterns). However, the strict UX implication for how this icon should behave functionally is undefined natively inside the UI Kit.
- **Impact:** It is currently ambiguous whether the component orchestrates a Read-Only `<pre>` to live `<TextField>` structural DOM swap, or if it simply drops an overarching `disabled={true}` state lock from an already rendered input node.
- **Current Resolution:** **RESOLVED**. The edit icon behavior explicitly does not map to or manipulate `readOnly` state natively. It strictly exposes a detached `onLabelEditClick={...}` callback. It is entirely up to the implementer to natively handle this event and determine how the application state or active component should react.

## Form Controls

### 1. Uncontrolled State Data Loss During `readOnly` Transitions

- **Description:** Form field abstractions (like `TextField`, `NumberField`, etc.) that act as Uncontrolled inputs structurally store their string interactions exclusively inside the native browser HTML DOM `<input>`. When toggling `readOnly={true}` dynamically, the library intentionally unmounts the active DOM node to mount the safe structural `<ReadOnlyField />` parser.
- **Impact:** Because the active node dies, the browser’s internal uncontrolled state is instantly destroyed. `WithReadOnlyWrapper` inherits an `undefined` value evaluation mapping straight into "N/A" (or empty defaults) rather than projecting the text the user actively typed natively.
- **Current Resolution:** **OPEN ISSUE**. Explicitly unresolved to avoid deeply wiring `useUncontrolled` state hooks natively across every wrapper. Developers must strictly supply Controlled inputs (by tracking `value` and `onChange` hooks externally in their views) if they conditionally inject ReadOnly capabilities sequentially on-the-fly.

## Loader

### 1. Missing Size Variants

- **Description:** Native Mantine sizes `xs` and `xl` are not currently supported by Recursica sizing configurations natively. The UI kit explicitly surfaces sizes `small`, `default`, and `large` for loader rendering.
- **Impact:** We cannot natively support structural scaling out to extremes.
- **Current Resolution:** We restrict the Loader to sizes mapped out by standard or structural scales: `sm`, `md`, `lg` (or structurally `small`, `default`, `large`). Passing `xs` or `xl` is officially unsupported and will fall back or not map.
