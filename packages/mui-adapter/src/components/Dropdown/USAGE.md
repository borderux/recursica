# Dropdown - Usage Guide

This document describes how to integrate and use the `Dropdown` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Dropdown } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Dropdown } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Dropdown placeholder="Select an option">
      <Dropdown.Item value="1">Option 1</Dropdown.Item>
      <Dropdown.Item value="2">Option 2</Dropdown.Item>
    </Dropdown>
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
