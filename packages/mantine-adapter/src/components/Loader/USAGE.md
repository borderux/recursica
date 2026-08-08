# Loader - Usage Guide

This document describes how to integrate and use the `Loader` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Loader } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Loader } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Loader size="md" />;
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

- `variant` maps to Mantine's loader types: `"oval"`, `"bars"`, or `"dots"`.
- `thickness` and `border-radius` are not exposed as props; sizing is controlled entirely by the `size` prop.
- The `xs` and `xl` sizes are not currently supported.
