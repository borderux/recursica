# Panel - Usage Guide

This document describes how to integrate and use the `Panel` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Panel } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Panel } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Panel>
      <Text>This is a clean, structured visual container.</Text>
    </Panel>
  );
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

## 1. Mapping to MUI Drawer

**Decision:** Panel maps to MUI's `Drawer` component, not `Paper` or `Card`.

**Implementation:** Per the Recursica design system specification, "Panels slide in or expand from the edge of the screen to reveal additional content or functionality." This is the exact behavior of MUI's `Drawer` component, which provides:

- Slide-in animation from any screen edge (using the `anchor` prop)
- Backdrop/overlay support
- Focus trap and overlay portal management
- Internal scroll lock when open

---

## 2. Token Namespace: `panel`

**Decision:** The CSS module exclusively uses variables from the `--recursica_ui-kit_components_panel_*` namespace.

**Implementation:** The Recursica token system defines the `panel` namespace covering:

- Geometry: border-radius, border-size, min-width (200px), max-width (960px)
- Content padding: content-horizontal-padding (xl), content-vertical-padding (lg)
- Header/Footer padding: header-footer-horizontal-padding (xl), header-footer-vertical-padding (md)
- Spacing: header-close-gap (md), footer-button-gap (md)
- Divider: divider-size (1px), divider-color
- Elevation: elevation-3
- Colors (layer-aware): background, border-color, content, divider-color, header-footer-background, title
- Non-CSS: header-style ("h3")

No tokens from other component namespaces are referenced.

---

## 3. Default Placement Override

**Decision:** Use `placement` instead of `position` for configuring slide-out direction, and default it to `"right"`.

**Implementation:** The prop was renamed from `position` to `placement` to prevent collision with the CSS `position` keyword, which is strictly blocked by the styling gatekeeper (`BLOCKED_STYLING_KEYS`). This allows configuring the drawer direction natively while maintaining strict design-system boundaries. The `placement="right"` default is mapped internally to MUI Drawer's `anchor` prop before any other sanitized props are applied. Right-side panels are the most common pattern for supplementary content, settings, and detail views.

---

## 4. Custom Panel.Footer

**Decision:** A custom `Panel.Footer` sub-component is provided. MUI's Drawer does not have a native footer.

**Implementation:** `Panel.Footer` is a `<div>` with styling referencing Recursica CSS variables for:

- `header-footer-background` and `header-footer-padding` tokens
- Top divider using `divider-size` and `divider-color`
- `footer-button-gap` for action button spacing
- `margin-top: auto` to push the footer to the bottom

---

## 5. Visibility Mapping (`opened` -> `open`)

**Decision:** Accept `opened` prop to match the standard Recursica component API.

**Implementation:** MUI Drawer natively expects the `open` boolean prop. The wrapper maps the incoming framework-agnostic `opened` prop to MUI's `open={Boolean(opened)}`, allowing consistent usage across both adapter implementations.
