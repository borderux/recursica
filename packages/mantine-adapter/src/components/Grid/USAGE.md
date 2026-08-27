# Grid - Usage Guide

This document describes how to integrate and use the `Grid` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Grid } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Grid } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Grid gutter="rec-default">
      <Grid.Col span={6}>Half width</Grid.Col>
      <Grid.Col span={{ xs: 12, sm: 6, md: 3 }}>Responsive width</Grid.Col>
    </Grid>
  );
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: `Grid` is a primitive layout component (see [OVERSTYLING.md](../../../OVERSTYLING.md)), so standard Mantine layout props pass through freely without needing `overStyled`.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Spacing is entirely determined by the `rec-*` token scale, mapped transparently to standard Mantine gutter values.

---

## 4. Key Integration Features & Constraints

The `Grid` component maps directly to Mantine's `Grid`/`Grid.Col` with no Recursica-specific prop renaming — `gutter`, `columns`, `grow`, `justify`, `align` on `Grid`, and `span`, `offset`, `order`, `visibleFrom`, `hiddenFrom` on `Grid.Col` all match Mantine's own naming and accept the same shapes, including per-breakpoint objects (`{ xs, sm, md, lg, xl }`). `gutter` additionally accepts `rec-*` spacing tokens.
