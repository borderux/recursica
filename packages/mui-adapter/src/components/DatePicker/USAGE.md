# DatePicker - Usage Guide

This document describes how to integrate and use the `DatePicker` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { DatePicker } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { DatePicker } from "@recursica/mui-adapter";

export default function Demo() {
  return <DatePicker label="Select Date" />;
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

## Structural Constraints

1. **Value Type**: `value`/`defaultValue`/`onChange` all speak plain `Date` objects (not MUI X's native `Dayjs`), matching the mantine-adapter's DatePicker convention — conversion to/from `Dayjs` happens internally.
2. **Read-Only Rendering**: When rendered in read-only mode, the selected date is displayed formatted as `MM/DD/YY`. If you need custom date formatting, pass a `readOnlyComponent` prop to control how the value is rendered.
3. **Calendar Popover Styling**: The UI Kit exports no calendar-specific tokens (surface, selected day, hover, today, in-range), so the calendar reuses the closest existing tokens — see `DATEPICKER_IMPLEMENTATION_NOTES.md` for the exact mapping, mirrored 1:1 from the mantine-adapter. The header's prev/next arrows and month-view toggle are styled as Recursica `text`-variant buttons.
4. **Typing vs. Popover Entry**: Unlike the mantine-adapter (popover-only selection), MUI X's field supports typing a date directly into its masked `MM/DD/YY` segments, in addition to picking from the popup calendar.
5. **Default Display/Entry Format**: `MM/DD/YY` (e.g. `08/19/26`), matching the mantine-adapter; pass your own `format` (a `dayjs` format string) via the standard MUI X `DatePicker` props to override.
6. **Default Leading Icon**: A calendar icon opens the picker from the start of the field by default; pass `slots={{ openPickerIcon: MyIcon }}` to override it.
