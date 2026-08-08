# Button - Usage Guide

This document describes how to integrate and use the `Button` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Button } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Button } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Button variant="primary" onClick={() => console.log("Clicked!")}>
      Click Me
    </Button>
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

When `loading={true}` is passed to the Button, the button is also automatically disabled, and its loading indicator's color may not always match the button's text color, which can affect contrast in some variants.
