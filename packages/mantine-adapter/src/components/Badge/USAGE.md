# Badge - Usage Guide

This document describes how to integrate and use the `Badge` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Badge } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Badge } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Badge variant="filled" size="md">
      Active
    </Badge>
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

## 1. Stripped Size Properties

As logged in `COMPONENT_ISSUES.md`, there are currently no Figma variables mapped for different `size` variants (`small`, `default`, etc.). The component explicitly `Omit`s the Mantine `size` property from its signature to prevent integrators from attempting to drive sizes that do not exist in the tokens.

## 2. Intent-Based Variants

Mantine supports multiple visual variants (`outline`, `filled`, `light`). However, the existing variable schema for `Badge` only defines "Styles" which act as intents (`alert`, `primary-color`, `success`, `warning`).

- Default is arbitrarily mapped to `primary-color` as we lack a pure `neutral` schema right now.
- `variant` mapped to underlying Mantine prop has been hardcoded to `filled`, since the Recursica coloring fully replaces the Mantine DOM.

## 3. The `overStyled` Prop

This component implements the newly added `overStyled` architectural standard. By default, passing inline `{style}` React properties to `Badge` will be ignored. This prevents accidental cascading regressions of our strict CSS-variables layouts unless a developer explicitly forces `overStyled={true}`.
