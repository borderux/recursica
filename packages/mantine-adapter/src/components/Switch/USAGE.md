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

## 1. Stripping Mantine's Size Engine

Mantine uses properties like `size`, `color`, and `radius` to dynamically map CSS layout values across its `.track` and `.thumb` nodes. We proactively strip and delete these properties using `filterStylingProps` to entirely neutralize this native behavior.

## 2. Hardcoded Values & Transitions

Mantine injects dynamic width/height attributes into its switch through inline CSS variables (e.g. `--switch-height`). To strictly enforce the UI Kit tokens without breaking Mantine's internal math, our `Switch.module.css` structurally remaps Mantine's internal variables explicitly:

```css
--switch-width: var(--switch-track-width);
--switch-height: calc(
  var(--switch-thumb-height) + (var(--switch-track-padding) * 2)
);
```

We also hardcode `border: none` since the UI kit designs rely purely on box-shadow elevations and background color tracking. Mantine’s default border logic is entirely disabled.

## 3. ReadOnly Behavior

Similar to `Checkbox`, the `Switch` component handles `readOnly` presentation by dropping the entire underlying node tree and falling back structurally onto `<FormControlWrapper>` when `readOnly: true`. This strictly preserves exact baseline alignment across all primitives without trying to hack disabled CSS to look like read-only text.

## 4. Hover State Reset

Mantine forcefully triggers track hover color states globally. Since Recursica currently does not map specific hover states to switch backgrounds across themes (falling back to standard unselected tokens or simply providing a cursor), we structurally wipe out Mantine's `.track:hover` class block inside `Switch.module.css`.
