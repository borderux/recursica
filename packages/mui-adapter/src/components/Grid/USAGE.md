# Grid - Usage Guide

This document describes how to integrate and use the `Grid` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Grid } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Grid } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Grid gap="rec-default">
      <Grid.Col span={6}>Half width</Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>Responsive width</Grid.Col>
    </Grid>
  );
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: `Grid` is a primitive layout component (see [OVERSTYLING.md](../../../OVERSTYLING.md)) — only the `sx` prop is stripped, everything else passes through freely without needing `overStyled`.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Spacing is entirely determined by the `rec-*` token scale, mapped transparently to MUI's `spacing` value.

---

## 4. Key Integration Features & Constraints

- `gap` controls the spacing between grid items.
- `span` accepts a column count, `"auto"`, `"content"`, or a responsive object (`{ base, sm, md, ... }`).
- `offset` shifts a column by a number of columns.
- `order` accepts a fixed number to control a column's visual order. A responsive object (`{ base, sm, md, ... }`) is **not** fully supported yet — only the smallest specified breakpoint's value is applied.
- `visibleFrom`/`hiddenFrom` show or hide a column at the standard breakpoints (600/900/1200/1536px).
