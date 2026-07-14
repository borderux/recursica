# Breadcrumb - Usage Guide

This document describes how to integrate and use the `Breadcrumb` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Breadcrumb } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Breadcrumb } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Breadcrumb>
      <Link href="/">Home</Link>
      <Link href="/components">Components</Link>
      <Text>Button</Text>
    </Breadcrumb>
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

## Missing Variants and Sizes

The `Breadcrumb` currently does not establish any size (`xs`, `sm`, etc.) or variant variables in the underlying design tokens (`recursica_ui-kit.json`). Only basic structural definitions for `padding` and `item-gap` exist. Because of this, the `size` and `variant` properties have been explicitly omitted from the passed mantine props.

## Gap Styling

We attach `gap` to `.root` directly within `.module.css`. Mantine's inner `separator` divs can natively accept our CSS variables for structural layout.

## Composition and Separators

We preserve standard hierarchical composition based on Mantine's defaults. The component natively accepts typical anchor tags as children without wrapping them in structural spans, allowing developers to utilize `Link` wrappers as needed contextually.
The separator character is inherited natively from Mantine's default configuration (`/`) unless overridden by passing `separator={<Icon />}` to the component props.
