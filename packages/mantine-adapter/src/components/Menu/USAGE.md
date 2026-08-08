# Menu - Usage Guide

This document describes how to integrate and use the `Menu` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Menu } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Menu } from "@recursica/mantine-adapter";

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

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Notes

- The full Mantine composition API is supported, including sub-menus: `Menu`, `Menu.Target`, `Menu.Dropdown`, `Menu.Item`, `Menu.Divider`, `Menu.Label`, `Menu.Sub`, `Menu.Sub.Target`, `Menu.Sub.Item`, and `Menu.Sub.Dropdown`.
- The `color` prop on `Menu.Item` (and `Menu.Sub.Item`) — used by Mantine for semantics like a "danger" item — is ignored unless `overStyled={true}` is set.
