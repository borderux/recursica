# Switch - Usage Guide

This document describes how to integrate and use the `Switch` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Switch } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Switch } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Switch label="Enable notifications" defaultChecked />;
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

The `size`, `color`, and `radius` props are not available on this component, since appearance is fully controlled by the design system tokens. When `readOnly` is set, the switch renders as a read-only label instead of an interactive control. There is currently no distinct hover color for the track; it falls back to the standard unselected background.
