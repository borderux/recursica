# Tabs - Usage Guide

This document describes how to integrate and use the `Tabs` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Tabs, Tab, TabPanel } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

Unlike the mantine-adapter, `Tabs` has no `.List`/`.Panel` compound API — it mirrors native
MUI's own `@mui/lab` split, where `Tabs`/`Tab` and `TabPanel` are separate elements coordinated
by `TabContext`. Because `TabPanel` renders as a sibling of `Tabs` (not nested inside it), wrap
both in a column-direction container yourself so the panel renders below the tab list instead of
beside it.

> [!WARNING] > `Tabs` wraps `@mui/material`'s `Tabs`, which does **not** read `TabContext` for its own
> selected state — only `TabPanel` (from `@mui/lab`) does that. You must pass `value` to `Tabs`
> explicitly, in addition to wrapping everything in `TabContext`. Omitting it silently leaves
> every tab unselected (no active styling, no indicator).

```tsx
import React, { useState } from "react";
import { TabContext } from "@mui/lab";
import { Tabs, Tab, TabPanel, Flex } from "@recursica/mui-adapter";

export default function Demo() {
  const [value, setValue] = useState("home");

  return (
    <Flex direction="column">
      <TabContext value={value}>
        <Tabs value={value} onChange={(_e, v) => setValue(v)}>
          <Tab value="home" label="Home" />
          <Tab value="profile" label="Profile" />
        </Tabs>
        <TabPanel value="home">Home content</TabPanel>
        <TabPanel value="profile">Profile content</TabPanel>
      </TabContext>
    </Flex>
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
