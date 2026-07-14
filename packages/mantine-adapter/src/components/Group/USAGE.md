# Group - Usage Guide

This document describes how to integrate and use the `Group` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Group } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Group } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Group gap="md" align="center">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Submit</Button>
    </Group>
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

The `Group` component is a generic flex layout wrapper mapped directly to Mantine's `Group`.
It currently does not require any custom logical layouts or CSS workarounds since it serves only to organize layout structure, and doesn't enforce any strict design-system token styling itself. All gap, align, wrap, and justify properties pass safely through via the `filterStylingProps` layout-property allowance.
