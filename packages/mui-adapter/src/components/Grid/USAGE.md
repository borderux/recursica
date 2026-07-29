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
> - **Anti-override protection**: `Grid` is a primitive layout component (see [OVERSTYLING.md](../../../OVERSTYLING.md)) and is exempt from the `RecursicaOverStyled` gatekeeper — only the `sx` prop is stripped, everything else passes through freely.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Spacing is entirely determined by the `rec-*` token scale, mapped transparently to MUI's `spacing` value.

---

## 4. Key Integration Features & Constraints

`Grid` and `Grid.Col` expose the same public API as the mantine-adapter's `Grid`/`Grid.Col` (same prop names and shapes), so code written against one adapter ports to the other without changes. Internally, MUI has no native `AppShell`-style Grid/Col split — MUI merges "container" and "item" into a single `Grid` component — so this adapter hand-composes `Grid` (always `container`) and `Grid.Col` (always item mode) from that single underlying component.

Notable mapping details:

- `gap` maps to MUI's own `spacing` prop (same concept as `gutter` on the mantine side).
- `span`'s `"auto"`/`"content"` keywords are the inverse of MUI's own `"grow"`/`"auto"` keywords — this adapter translates between them internally, so the public `span` values match Mantine's semantics exactly regardless of adapter.
- `offset` maps directly to MUI's own `offset` prop (same name, same shape).
- `order` is applied directly for a fixed number. A responsive object (`{ base, sm, md, ... }`) is **not** fully supported yet — the smallest specified breakpoint's value is applied as a single static order, since MUI's Grid has no native per-breakpoint `order` mechanism. See `IMPLEMENTATION_NOTES.md`.
- `visibleFrom`/`hiddenFrom` are implemented via a small CSS module using MUI's own default breakpoint pixel values (600/900/1200/1536), since MUI's Grid has no built-in breakpoint-visibility mechanism.
