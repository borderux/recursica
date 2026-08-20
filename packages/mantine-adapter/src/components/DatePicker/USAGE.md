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
  return <DatePicker label="Select Date" />;
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
2. **Calendar Popover Styling**: The UI Kit exports no calendar-specific tokens (surface, selected day, hover, today, weekend, in-range), so the calendar reuses the closest existing tokens — see `DATEPICKER_IMPLEMENTATION_NOTES.md` for the exact mapping. All calendar states are token-driven; none are left on Mantine's un-tokenized defaults. The header's prev/next arrows and month/year label are styled as Recursica `text`-variant buttons.
3. **Today Highlighting**: `highlightToday` defaults to `true` so the current day is always visually marked; pass `highlightToday={false}` to turn it off.
4. **Default Value Format**: Displayed values default to `MM/DD/YY` (e.g. `08/19/26`); pass your own `valueFormat` (a `dayjs` format string) to override.
5. **Default Leading Icon**: A calendar icon is shown in the left section by default; pass your own `leftSection` to override it.
6. **Default Placeholder**: Defaults to `"MM / DD / YY"` when not set; pass your own `placeholder` to override it.
