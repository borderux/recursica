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

## 4. Key Integration Features & Constraints

- **Compositional API Dropped:** Mantine uses `<Menu.Target>`, `<Menu.Dropdown>`, `<Menu.Item>`, etc., and manages state natively via React context within `<Menu>`. MUI's API is fully monolithic.
- **Monolithic API Adopted:** Following architectural review, we have abandoned the fabricated context wrappers for `mui-adapter`. We now natively export `Menu`, `MenuItem`, and `MenuDivider` wrapping their `@mui/material` counterparts. Developers are expected to manage `anchorEl` state themselves, just like native MUI. Storybook tests have been updated to simulate this open state so visual regressions still cover the dropdown menu visually.
