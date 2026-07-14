# SegmentedControl - Usage Guide

This document describes how to integrate and use the `SegmentedControl` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { SegmentedControl } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { SegmentedControl } from "@recursica/mantine-adapter";

export default function Demo() {
  return <SegmentedControl data={["Preview", "Code", "Edit"]} />;
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

## 1. Stripping Mantine's Native Variants and Sizes

The Figma design tokens for the SegmentedControl component do not define nested layers of variants (such as `solid`, `outline`) or specific sizing steps (`xs`, `sm`, etc.). They are defined globally. Therefore, we explicitly `Omit` the standard `variant`, `size`, `radius`, and `color` props from the generic Mantine `SegmentedControlProps` interface.

## 2. Hardcoded Overrides for Figma Strictness

Mantine injects inline hover styles on `.label` (specifically, adding a subtle gray background when hovering). Since Recursica defines explicit transparent or specifically-driven hover states, we use `!important` tags within `SegmentedControl.module.css` for background and typography overriding.

## 3. Divider Separators

Mantine uses an `::before` pseudo-element on the `.control` block to draw standard visual separators between adjacent elements. Instead of stripping this functionality out, we hook directly into the pseudo-element and override its `background-color` with `--recursica_ui-kit_components_segmented-control_properties_colors_divider-color`.

## 4. Indicator Mapping

The moving active background element (`.indicator`) is decoupled from the actual text label. It is styled natively with its own background color, border size, and elevation shadow variables to match the exact visual parity of a "floating active chip" as defined in the Recursica properties map.
