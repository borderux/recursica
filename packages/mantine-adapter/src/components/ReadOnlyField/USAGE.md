# ReadOnlyField - Usage Guide

This document describes how to integrate and use the `ReadOnlyField` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { ReadOnlyField } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { ReadOnlyField } from "@recursica/mantine-adapter";

export default function Demo() {
  return <ReadOnlyField label="API Key" value="sk_test_123456789" copyable />;
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

### Editable Mode

If an edit action (e.g. via `labelActionArea`) is used to let a user switch a field from read-only to editable, that switch is one-directional in the UI — there is no built-in control (such as blurring the input) that switches it back to read-only. To revert to read-only, the parent must pass an updated `readOnly` value.
