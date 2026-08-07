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

> [!IMPORTANT] > **Recursica-specific behavior:** by default, `TimePicker` renders in **12-hour format with a dedicated AM/PM selector** next to the hour/minute input — this deviates from the underlying Mantine library's own default (24-hour, no AM/PM control). Pass `hideAmPm` to switch to a plain 24-hour input with no AM/PM control, matching Mantine's native default instead.

```tsx
<TimePicker label="Meeting Time" hideAmPm />
```

Pass `withSeconds` to add a seconds segment, and `minTime`/`maxTime` (`"HH:mm"` or `"HH:mm:ss"` with `withSeconds`) to bound the allowed range — these always describe 24-hour boundaries regardless of `hideAmPm`.

```tsx
<TimePicker
  label="Precise Time"
  withSeconds
  minTime="09:00:00"
  maxTime="17:00:00"
/>
```

**Note:** the AM/PM control renders as a native HTML `<select>` — Mantine's `TimePicker` doesn't support swapping it for a fully custom dropdown component, so it won't pixel-match Recursica's own `Dropdown` component, particularly its open option list (browser/OS-rendered).

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

Pass `readOnly` to render the current value as static text via the shared `FormControlWrapper` read-only presentation, matching every other Recursica form control.
