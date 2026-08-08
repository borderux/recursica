# TimePicker - Usage Guide

This document describes how to integrate and use the `TimePicker` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { TimePicker } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { TimePicker } from "@recursica/mantine-adapter";

export default function Demo() {
  return <TimePicker label="Select Time" />;
}
```

> [!IMPORTANT] > **Recursica-specific behavior:** `TimePicker` always renders in **12-hour format with a dedicated AM/PM `Dropdown`-style selector** next to the hour/minute input — this deviates from the underlying Mantine library's own default (24-hour, no AM/PM control) and is **not configurable**. There is no prop to switch to a plain 24-hour input; this is the only way the component operates.

Pass `withSeconds` to add a seconds segment, and `minTime`/`maxTime` (`"HH:mm"` or `"HH:mm:ss"` with `withSeconds`) to bound the allowed range — these always describe 24-hour boundaries.

```tsx
<TimePicker
  label="Precise Time"
  withSeconds
  minTime="09:00:00"
  maxTime="17:00:00"
/>
```

The AM/PM control visually matches Recursica's `Dropdown` component exactly, rather than a native `<select>`.

---

## 3. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Read-Only Mode

Pass `readOnly` to render the current value as static text, matching every other Recursica form control. The value is formatted as 12-hour + AM/PM (e.g. `"14:30"` displays as `"2:30 PM"`).
