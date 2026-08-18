# TransferList - Usage Guide

This document describes how to integrate and use the `TransferList` component in your projects
using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { TransferList } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { TransferList } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <TransferList
      label="Assign users"
      sourceLabel="Available"
      targetLabel="Selected"
      defaultData={[
        [
          { value: "1", label: "Item 1" },
          { value: "2", label: "Item 2" },
        ],
        [{ value: "3", label: "Item 3" }],
      ]}
      onChange={(data) => console.log(data)}
    />
  );
}
```

Items sharing a `group` field render under a `CheckboxGroup` heading in their pane:

```tsx
<TransferList
  label="Assign ingredients"
  defaultData={[
    [
      { value: "apple", label: "Apple", group: "Fruit" },
      { value: "carrot", label: "Carrot", group: "Vegetable" },
      { value: "eagle", label: "Eagle" }, // ungrouped, renders above the groups
    ],
    [],
  ]}
/>
```

Pass `data` instead of `defaultData` to control the selection yourself.

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system
spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary
>   `className`) are automatically blocked by our prop layer unless `overStyled={true}` is
>   explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific
>   visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in
>   `recursica_variables_scoped.css` and mapped in the component's CSS module.
> - **Form control layout**: `label`, `formLayout` (`stacked`/`side-by-side`), `required`,
>   `assistiveText`/`description`/`helperText`, and `error` all route through the shared
>   `FormControlWrapper`, same as every other form control.
