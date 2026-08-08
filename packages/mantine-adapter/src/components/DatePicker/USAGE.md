# DatePicker - Usage Guide

This document describes how to integrate and use the `DatePicker` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { DatePicker } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { DatePicker } from "@recursica/mantine-adapter";

export default function Demo() {
  return <DatePicker label="Select Date" placeholder="Pick a date" />;
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

## Structural Constraints

1. **Read-Only Rendering**: When rendered in read-only mode, the selected date is displayed via a plain string conversion of the value. If you need custom date formatting, pass a `readOnlyComponent` prop to control how the value is rendered.
2. **Calendar Popover Styling**: The calendar popover is not yet fully styled by design tokens.
