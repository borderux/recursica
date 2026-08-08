# AutoComplete - Usage Guide

This document describes how to integrate and use the `AutoComplete` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { AutoComplete } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { AutoComplete } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <AutoComplete
      label="Country"
      placeholder="Type a country name..."
      data={["USA", "Canada", "Mexico"]}
    />
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

### Known Limitation: Active Option Highlight

The background highlight for a hovered or active option in the dropdown is not currently visible. This will be addressed in a future update.
