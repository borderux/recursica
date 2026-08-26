# Autocomplete - Usage Guide

This document describes how to integrate and use the `Autocomplete` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Autocomplete } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Autocomplete } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Autocomplete
      label="Country"
      placeholder="Type a country name..."
      data={["USA", "Canada", "Mexico"]}
    />
  );
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

## 4. Rich option content: `leadingIcon` / `supportingText`

`data` items can carry an icon and a secondary line of text, rendered inside each option row:

```tsx
<Autocomplete
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

Pass your own `renderOption` to opt out of this default rendering for a given instance.

By default `label`/`supportingText` truncate to a single line with an ellipsis. Set
`wrapItemText` to wrap them onto additional lines instead: `<Autocomplete data={data} wrapItemText />`.
