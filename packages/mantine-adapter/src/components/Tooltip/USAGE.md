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

## 2. Behavior Notes

Tooltip text always wraps to fit within the token-defined max width, rather than staying on a single line or overflowing. The `multiline` prop is not exposed, since this behavior is always on.

---

## 3. Recursica `withBeak` Prop

**Decision:** `withBeak` is the official Recursica prop for controlling beak visibility, defaulting to `true`.

**Implementation:** Both `withBeak` and Mantine's `withArrow` are accepted. When both are provided, `withBeak` takes precedence. The beak's size can be adjusted via the `arrowSize` prop (default `16`).

---

## 4. Tooltip.Floating and Tooltip.Group

**Decision:** These static sub-components are direct pass-throughs to Mantine with no Recursica styling.

**Implementation:** `Tooltip.Floating` follows the cursor and uses a different rendering mechanism than standard Tooltip. `Tooltip.Group` is a utility for shared delay timing. Neither has Recursica design tokens defined, so they remain unstyled pass-throughs. If tokens are added in the future, they can be wrapped independently.

---

## 5. Default Position

Recursica defaults `position` to `"top"` instead of Mantine's default of `"bottom"`. Pass your own `position` value to override it.
