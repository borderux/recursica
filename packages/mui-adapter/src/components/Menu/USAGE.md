# Menu - Usage Guide

This document describes how to integrate and use the `Menu` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Menu } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Menu } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Toggle Menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item color="red">Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
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

## 4. Notes

- `maxHeight` on `<Menu>` overrides the dropdown's token-driven max-height with an explicit pixel (or other CSS length) value, e.g. `<Menu maxHeight={320}>`. It's a per-instance escape hatch, not a design token — leave it unset to use the token default.
