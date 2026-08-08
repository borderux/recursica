# Label - Usage Guide

This document describes how to integrate and use the `Label` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Label } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Label } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Label required>Field Label</Label>;
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

## 4. Behavior Notes

- A label cannot be both required and optional: if `required` is `true`, `optionalText` is not rendered.
- Set `optionalText` to `true` to render the default "(Optional)" text, or pass a custom string for different wording.
- `withEditIcon` and `required` are mutually exclusive: when both are set, the edit icon is shown in place of the required asterisk.
- `labelSize` only affects layout when the surrounding form uses `formLayout="side-by-side"`, where it constrains the label's width.
- `Label` does not currently support a `description` prop.
- The edit icon does not currently have a distinct hover background.
