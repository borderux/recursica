# FormControlWrapper - Usage Guide

This document describes how to integrate and use the `FormControlWrapper` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { FormControlWrapper } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { FormControlWrapper } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <FormControlWrapper label="Email Address" required error="Invalid email">
      <input type="email" />
    </FormControlWrapper>
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

- `FormControlWrapper` renders the label, error, and help text around the child input; screen-reader associations between the input and its assistive text are handled automatically.
- The wrapper stretches to fill its container by default. If the wrapped input has its own maximum width, pass a matching `--form-control-max-width` CSS variable via the `style` prop so the label and assistive text align to the same width as the input.
