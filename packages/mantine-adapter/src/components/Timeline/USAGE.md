# Timeline - Usage Guide

This document describes how to integrate and use the `Timeline` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Timeline } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Timeline } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Timeline active={1}>
      <Timeline.Item title="Step 1">Created branch</Timeline.Item>
      <Timeline.Item title="Step 2">Pushed changes</Timeline.Item>
    </Timeline>
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

`Timeline.Item` accepts a `timestamp` prop that renders below the item's content, and a `bulletVariant` prop (`"default" | "avatar" | "icon" | "icon-alternative"`) to control the bullet's appearance. The `lineWidth` and `bulletSize` props are not configurable, since geometry is controlled by the design system tokens.

A known limitation: when using `bulletVariant="avatar"`, the avatar bullet always renders at the default bullet size rather than a custom size.
