# NumberInput - Usage Guide

This document describes how to integrate and use the `NumberInput` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { NumberInput } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { NumberInput } from "@recursica/mantine-adapter";

export default function Demo() {
  return <NumberInput label="Quantity" min={1} max={10} defaultValue={1} />;
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

## 1. Label, Description, and Error Rendering

Label, description, and error text are rendered using Recursica's standard form-control layout rather than Mantine's native label/description/error rendering, so spacing and styling stay consistent with other form fields.

## 2. Right Section & Controls

Providing a custom `rightSection` element replaces the built-in increment/decrement controls. To use both together, rebuild the controls manually using Mantine's `handlersRef` API within your custom right section.

## 3. Controls Styling

The increment/decrement control icons currently fall back to Mantine's default styling beyond their color, as design tokens for their background, border, and hover states are not yet defined.
