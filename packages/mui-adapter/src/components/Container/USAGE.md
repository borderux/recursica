# Container - Usage Guide

This document describes how to integrate and use the `Container` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Container } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Container } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Container size="lg">
      <Text>Centered content container constrained by maximum width.</Text>
    </Container>
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

By design, the `Container` component explicitly allows the `sx` prop to pass through to the underlying MUI `Container`. Unlike standard UI kit components (which use the `RecursicaOverStyled` gatekeeper) or flex layout primitives (which strip `sx` via `OmitSx` and `filterSxProp`), `Container` acts as a structural boundary where advanced, one-off positioning adjustments may be required by the consuming application.
