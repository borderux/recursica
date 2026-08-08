# Toast - Usage Guide

This document describes how to integrate and use the `Toast` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Toast } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Toast } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Toast
      title="Success"
      message="Your action completed successfully"
      variant="success"
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

`Toast` can be used directly for a static or inline message, or wired up to `@mantine/notifications` for dynamic popups. The `variant` prop (`"default" | "error" | "success"`) controls the toast's color treatment.

The `loading` state is not supported. If a loading toast is needed, pass a `<Loader />` component into the `icon` slot instead.
