# Tooltip - Usage Guide

This document describes how to integrate and use the `Tooltip` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Tooltip } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Tooltip } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Tooltip label="This is a helpful tooltip">
      <Button variant="primary">Hover Me</Button>
    </Tooltip>
  );
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

## 1. Single Component API (Not Composable)

**Decision:** Unlike HoverCard (which uses `HoverCard` + `HoverCard.Target` + `HoverCard.Dropdown`), Tooltip is a single wrapper component.

**Implementation:** Mantine's `Tooltip` takes content via a `label` prop and wraps the trigger element as `children`. There are no separate Target/Dropdown sub-components. The Recursica wrapper preserves this exact API.

**Static sub-components:** `Tooltip.Floating` and `Tooltip.Group` are exposed as pass-through references to Mantine's implementations. These do not receive Recursica styling treatment — they are utility wrappers for cursor-following tooltips and shared delay grouping respectively.

---

## 2. Token Namespace: `tooltip`

**Decision:** The CSS module exclusively uses variables from the `--recursica_ui-kit_components_tooltip_*` namespace.

**Implementation:** The Recursica token system defines the `tooltip` namespace covering:

- Geometry: border-radius, border-size, min-width, min-height, max-width, padding
- Typography: text_font-\* (family, size, style, weight, letter-spacing, line-height, text-decoration, text-transform)
- Colors (layer-aware): background, border-color, text
- Elevation: box-shadow
- Beak: beak-size (16px), beak-inset (8px)

No tokens from other component namespaces are referenced.

---

## 3. Hardcoded Values

### `border-style: solid` (CSS module)

Mantine renders the tooltip using its `Box` component, which does not set `border-style` natively. Without this hardcoded value, the border-width and border-color tokens would have no visible effect. Same pattern as Menu and HoverCard dropdowns.

### `arrowSize` defaulted to `16` (Tooltip.tsx)

Mantine's `arrowSize` prop is a JavaScript number used for inline style calculations: it sets `width`, `height`, and a positioning offset (`-arrowSize/2`) directly on the arrow `<div>` element. These inline styles cannot be overridden via CSS without `!important`, and the positioning offset has no CSS equivalent. The beak size cannot be fully CSS-driven.

The default value `16` matches the Recursica `beak-size` token (`--recursica_ui-kit_components_tooltip_properties_beak-size: 16px`). Developers can override `arrowSize` if needed. This is documented as an open issue in `docs/COMPONENT_ISSUES.md`.

**Note:** Mantine calls this the "arrow"; Recursica calls it the "beak". The Recursica prop `withBeak` (defaulting to `true`) maps to Mantine's `withArrow`. Both are accepted; `withBeak` takes precedence.

### `multiline={true}` (Tooltip.tsx)

Mantine's `multiline` prop controls whether tooltip text wraps (`white-space: nowrap` when false). Recursica always enables multiline because the design system defines a `max-width` token (300px) — text should wrap naturally within that constraint rather than overflowing. The `multiline` prop is not exposed to developers.

### Flexbox centering (CSS module)

`display: flex; align-items: center; justify-content: center;` is applied to the `.tooltip` class. This ensures text is vertically and horizontally centered within the `min-height: 48px` container defined by the design token. Without this, text sits at the top of the tooltip.

---

## 4. Recursica `withBeak` Prop

**Decision:** `withBeak` is the official Recursica prop for controlling beak visibility, defaulting to `true`.

**Implementation:** Both `withBeak` and Mantine's `withArrow` are accepted. Resolution order: `withBeak ?? withArrow`. When both are provided, `withBeak` takes precedence. The default of `true` means tooltips show the beak by default, matching the Recursica design intent.

---

## 5. ClassNames Binding

**Decision:** CSS module classes are bound via the `classNames` prop on Mantine's Tooltip root.

**Implementation:** The stylesNames for Tooltip are `tooltip` (the container) and `arrow` (the beak). Both are mapped to their respective CSS module classes: `{ tooltip: styles.tooltip, arrow: styles.arrow }`. Consumer-provided `classNames` are merged additively when `overStyled` is true.

---

## 6. Tooltip.Floating and Tooltip.Group

**Decision:** These static sub-components are direct pass-throughs to Mantine with no Recursica styling.

**Implementation:** `Tooltip.Floating` follows the cursor and uses a different rendering mechanism than standard Tooltip. `Tooltip.Group` is a utility for shared delay timing. Neither has Recursica design tokens defined, so they remain unstyled pass-throughs. If tokens are added in the future, they can be wrapped independently.

---

## 7. Default Position Override

**Decision:** Recursica defaults `position` to `"top"`. Mantine defaults to `"bottom"`.

**Implementation:** The `position="top"` default is set on the Mantine root element before the prop spread, so developer-provided `position` values still take precedence. This aligns with Recursica's design intent for overlay components to appear above their trigger by default.
