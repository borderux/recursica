# Slider - Usage Guide

This document describes how to integrate and use the `Slider` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Slider } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Slider } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Slider defaultValue={50} min={0} max={100} label="Volume" />;
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

The `label` prop is passed through to the surrounding form label rather than Mantine's dragging tooltip; use `tooltipLabel` to set the label shown while dragging. When `showInput` is enabled, a numeric text input is rendered alongside the track and stays in sync with the slider's value. Set `showMinMaxLabels` to `false` to hide the min/max guides shown at either end of the track. Otherwise, the current value is displayed near the track instead.
