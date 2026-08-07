# TimePicker - Usage Guide

This document describes how to integrate and use the `TimePicker` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { TimePicker } from "@recursica/mui-adapter";
```

`TimePicker` requires `@mui/x-date-pickers` (optional peer dependency) to be installed alongside `@mui/material`. See [SETUP.md](../../../SETUP.md).

---

## 2. Basic Example

```tsx
import React from "react";
import { TimePicker } from "@recursica/mui-adapter";

export default function Demo() {
  return <TimePicker label="Select Time" />;
}
```

`TimePicker`'s value is a plain `"HH:mm"` string (matching `@recursica/mantine-adapter`'s convention). Pass `withSeconds` to add a seconds segment (`"HH:mm:ss"`), and `minTime`/`maxTime` (in the same string format) to bound the allowed range.

```tsx
<TimePicker
  label="Precise Time"
  withSeconds
  minTime="09:00:00"
  maxTime="17:00:00"
  onChange={(value) => console.log(value)} // "HH:mm:ss" | null
/>
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.
> - **Known limitation**: the closed field is fully token-driven; the open clock/list dropdown currently renders with MUI's default styling (no Figma token spec exists for it yet).

---

## 4. Read-Only Mode

Pass `readOnly` to render the current value as static text via the shared `FormControlWrapper` read-only presentation, matching every other Recursica form control.
