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

## Menu

### 1. Stripped `color` Prop on Menu.Item

- **Description:** Mantine's `Menu.Item` natively supports a `color` prop for semantic color overrides (e.g., `color="red"` for destructive actions). This prop is explicitly stripped in Recursica's strict mode to enforce design token adherence.
- **Impact:** Developers cannot natively differentiate "danger" or semantic-colored menu items purely through component props. All item colors are driven exclusively by the `menu-item` Recursica CSS variables.
- **Current Resolution:** The `color` prop is deleted during prop sanitization when `overStyled={false}`. Developers requiring semantic colors must use `overStyled={true}` as an explicit escape hatch. A future Recursica token update could introduce `variant="danger"` support with dedicated token variables.

### 2. Missing Disabled State Tokens

- **Description:** The Recursica token set does not include dedicated `disabled` state color variables for menu items (e.g., `menu-item_properties_colors_disabled_text`).
- **Impact:** Disabled items fall back to a hardcoded `opacity: 0.5` value rather than using token-driven disabled colors.
- **Current Resolution:** A generic `opacity: 0.5` is applied to `[data-disabled]` menu items with `cursor: not-allowed` and `pointer-events: none`. This should be revisited when disabled-state tokens are added to the Figma token structure.

## HoverCard

### 1. Beak Size Cannot Be Fully CSS-Driven

- **Description:** Recursica defines a `beak-size` design token (`--recursica_ui-kit_components_hover-card-popover_properties_beak-size: 16px`) intended to control the beak (arrow) size via CSS. However, Mantine's `arrowSize` prop is a JavaScript number used for inline style calculations: it sets `width`, `height`, and a positioning offset (`-arrowSize/2`) directly on the arrow `<div>` element. These inline styles cannot be overridden via CSS without `!important`, and the positioning offset has no CSS-only equivalent.
- **Impact:** The beak size is not purely token-driven. The `arrowSize` default (16) in `HoverCard.tsx` must be manually kept in sync with the `beak-size` token value. Developers can also override `arrowSize` via props, which breaks design system consistency.
- **Current Resolution:** `arrowSize` defaults to `16` in the component to match the token. The value is documented as a hardcoded exception in `HOVERCARD_IMPLEMENTATION_NOTES.md`. A future improvement could involve reading the CSS variable value at runtime via `getComputedStyle`, though this would add complexity and a dependency on `useEffect`/state.

## Tooltip

### 1. Beak Size Cannot Be Fully CSS-Driven

- **Description:** Same limitation as HoverCard. Recursica defines a `beak-size` design token (`--recursica_ui-kit_components_tooltip_properties_beak-size: 16px`) intended to control the beak (arrow) size via CSS. However, Mantine's `arrowSize` prop is a JavaScript number used for inline style calculations (`width`, `height`, and `-arrowSize/2` positioning offset) that cannot be CSS-driven.
- **Impact:** The beak size is not purely token-driven. The `arrowSize` default (16) in `Tooltip.tsx` must be manually kept in sync with the `beak-size` token value.
- **Current Resolution:** `arrowSize` defaults to `16` in the component to match the token. Same approach as HoverCard.

## Panel

### 1. header-style Token Reference Bug

- **Description:** The UI Kit JSON outputs the `header-style` token as the raw string `"h3"` rather than a structural typography reference. This prevents the compiler from automatically generating the expected nested typography CSS variables (e.g., `--recursica_ui-kit_components_panel_properties_header-style_fontFamily`).
- **Impact:** We cannot natively map the `header-style` token to the `.title` class in the CSS module because attempting to reference the non-existent fallback variables breaks the PostCSS build pipeline.
- **Current Resolution:** We have completely stripped typography variable bindings from the `.title` class and are relying exclusively on the `color` token and Mantine's defaults. This should be revisited once the Figma UI Kit is updated to correctly export `header-style` as a typography reference.

## NumberInput

### 1. `rightSection` Overwrites Increment/Decrement Controls

- **Description:** Mantine natively renders its increment/decrement arrows inside the `rightSection` DOM slot. Providing a custom `rightSection` prop to the component intentionally deletes these stepper arrows.
- **Impact:** It is structurally impossible to render both a right-aligned icon and the stepper controls simultaneously without heavily rebuilding Mantine's abstract native `handlersRef` logic inside a custom wrapper layout.
- **Current Resolution:** The component inherits the native behavior where the `rightSection` definitively overwrites the controls. If an icon is required alongside controls, it must be passed into `leftSection` instead.

### 2. Missing Explicit Design Tokens for Controls

- **Description:** The Recursica Figma UI Kit provides generic tokens for `number-input` layout geometry and overall colors, but lacks explicit targeting variants for the internal increment/decrement arrow controls (e.g., specific hover backgrounds, icon colors, or border divisions for the arrows themselves).
- **Impact:** We cannot construct an exact 1-to-1 visual parity if design expects the arrows to have custom dividers or standalone highlight states.
- **Current Resolution:** The controls have had their default borders stripped out to float seamlessly inside the main input wrapper, and they inherit generic icon tokens, but complex hover background mappings rely on native Mantine fallback states.
