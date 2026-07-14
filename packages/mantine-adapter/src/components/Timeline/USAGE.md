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

## Architecture

The `Timeline` component is a strict structural wrapper around Mantine's `<Timeline>` and `<Timeline.Item>` components.

- `Timeline.tsx` intercepts overarching properties like `lineWidth` and `bulletSize` to strip them out via `overStyled`, strictly adhering to the CSS token mapping in `.item` rules instead.
- `TimelineItem.tsx` implements a custom `timestamp` React node rendering slot to match the design system, positioning the text directly below the item's `children`.
- `TimelineItem.tsx` supports a custom `bulletVariant` prop (`"default" | "avatar" | "icon" | "icon-alternative"`) mapped onto `data-variant` to handle CSS variations dynamically.

## Limitations & Missing Tokens

- **Avatar Bullet Size**: There is no specific pixel variable provided for the Avatar bullet size in the UI kit tokens (`avatar-size` evaluates to `"default"`). To maintain exact mathematical centering with Mantine's connector line `calc()` equations, the CSS falls back to inheriting the `default` bullet size (`20px`) for avatar nodes natively. If users supply a custom sized `img` tag, it must adhere to inline structural constraints or flex mappings.
