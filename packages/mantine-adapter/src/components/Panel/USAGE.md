# Panel - Usage Guide

This document describes how to integrate and use the `Panel` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Panel } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Panel } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Panel>
      <Text>This is a clean, structured visual container.</Text>
    </Panel>
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

### Placement

Use the `placement` prop (not `position`) to choose which edge the panel slides in from: `"left"`, `"right"`, `"top"`, or `"bottom"`. It defaults to `"right"`.

### Panel.Footer

A `Panel.Footer` sub-component is available for footer content and action buttons.

### Content Overflow

When content exceeds the panel's available height, the body scrolls internally while the header and footer stay fixed in place.
