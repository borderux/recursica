# AutoComplete - Usage Guide

This document describes how to integrate and use the `AutoComplete` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { AutoComplete } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { AutoComplete } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <AutoComplete
      label="Country"
      placeholder="Type a country name..."
      data={["USA", "Canada", "Mexico"]}
    />
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

### Rich option content: `leadingIcon` / `supportingText`

`data` items can carry an icon and a secondary line of text, rendered inside each option row:

```tsx
<AutoComplete
  label="Assignee"
  data={[
    {
      value: "jdoe",
      label: "Jane Doe",
      leadingIcon: <UserIcon />,
      supportingText: "jane.doe@example.com",
    },
    { value: "asmith", label: "Alex Smith" },
  ]}
/>
```

- `label` is optional, same as always — items with `value` only still work, falling back to
  `value` as the displayed/matched text.
- Pass your own `renderOption` to opt out of this default rendering entirely for a given
  component instance.
- By default `label`/`supportingText` truncate to a single line with an ellipsis. Set
  `wrapItemText` to wrap them onto additional lines instead:

```tsx
<AutoComplete data={data} wrapItemText />
```

### Known Limitation: Selected Option Highlight

Hover works (see `.option:hover`/`.option[data-hovered="true"]`), but there's no distinct "this option matches the current value" background — unlike `Dropdown`, which has one. This isn't a styling gap: Mantine's `Autocomplete` never passes a `value` prop into its internal `OptionsDropdown` (only `search`, for filtering — see `Autocomplete.mjs`), so `checked`/`data-combobox-active` (the attribute that drives `Dropdown`'s equivalent highlight) never gets set on any option, regardless of what's typed into the field. There's no other DOM signal to key a CSS rule off. Would need either an upstream Mantine change or reimplementing option rendering ourselves with a value comparison.
