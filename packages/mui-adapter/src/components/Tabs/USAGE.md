# Tabs - Usage Guide

This document describes how to integrate and use the `Tabs` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Tabs } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Tabs } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Tabs defaultValue="home">
      <Tabs.List>
        <Tabs.Tab value="home">Home</Tabs.Tab>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="home">Home content</Tabs.Panel>
      <Tabs.Panel value="profile">Profile content</Tabs.Panel>
    </Tabs>
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

- **Compositional API Dropped:** Mantine uses `<Tabs.List>`, `<Tabs.Tab>`, and `<Tabs.Panel>` natively with implicit context from `<Tabs>`. MUI relies on `@mui/lab/TabContext` and separates `Tabs` and `TabPanel`.
- **Monolithic API Adopted:** Following architectural review, we have opted to drop the broken dot-notation wrappers for `mui-adapter`. We now natively export `Tabs` (MUI List), `Tab` (MUI Item), and `TabPanel` (from `@mui/lab`). Developers must use `TabContext` (from `@mui/lab`) to manage state, just like native MUI. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.
