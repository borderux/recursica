# HoverCard - Usage Guide

This document describes how to integrate and use the `HoverCard` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { HoverCard } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { HoverCard } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <HoverCard>
      <HoverCard.Target>
        <Text>Hover over me</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">This is the hover card popup content.</Text>
      </HoverCard.Dropdown>
    </HoverCard>
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

- Mantine calls the pointer indicator the "arrow"; Recursica calls it the "beak". Use the `withBeak` prop (default `true`) to show or hide it; `withArrow` is also accepted for compatibility, with `withBeak` taking precedence.
- The default `position` is `"top"` (Mantine's default is `"bottom"`); pass your own `position` prop to override it.
