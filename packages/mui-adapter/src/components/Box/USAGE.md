# Box - Usage Guide

This document describes how to integrate and use the `Box` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Box } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Box } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Box>
      <Text>This is a basic layout container.</Text>
    </Box>
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

## `sx` Prop Exemption

By design, the `Box` component is the most permissive primitive in the UI kit. It explicitly allows the `sx` prop to pass through to the underlying MUI `Box`. It does not use any strict styling gatekeepers (`RecursicaOverStyled`, `filterSxProp`). It is intended to be used as a final escape hatch when the standard layout primitives or design system tokens cannot fulfill a unique layout requirement.
