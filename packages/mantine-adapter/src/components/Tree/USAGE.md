# Tree - Usage Guide

This document describes how to integrate and use the `Tree` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Tree } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Tree } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Tree
      data={[
        {
          value: "1",
          label: "Root",
          children: [
            { value: "1.1", label: "Child A" },
            { value: "1.2", label: "Child B" },
          ],
        },
        { value: "2", label: "Sibling" },
      ]}
    />
  );
}
```

Each node needs a unique `value` and a `label`. Any node with a `children` array (even an empty one) renders an expand/collapse chevron.

---

## 3. Controlled Selection / Expansion

```tsx
<Tree
  data={data}
  initialExpandedValues={["1"]}
  initialSelectedValues={["1.1"]}
  multiple
  onSelectedChange={(values) => console.log("selected:", values)}
  onNodeExpand={(value) => console.log("expanded:", value)}
  onNodeCollapse={(value) => console.log("collapsed:", value)}
/>
```

- `initialExpandedValues` accepts an array of node values, or `"*"` to start with every node expanded.
- `multiple` allows more than one node to be selected at once (default: single-select).
- `expandOnClick` / `selectOnClick` (both default `true`) control whether clicking a row toggles its expansion and/or selection.

---

## 4. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 5. Known Constraints

- No checkbox/multi-check styling is exposed — the underlying Mantine `Tree` supports a `checked` node state, but Recursica's `tree` design tokens don't yet define a checked visual state, so it isn't part of the Recursica API.
- No per-node `disabled` state — the Figma UI Kit tokens don't define one, and Mantine's `Tree` data shape has no built-in `disabled` field either.
