# Tree - Usage Guide

This document describes how to integrate and use the `Tree` component in your projects using `@recursica/mui-adapter`.

> [!IMPORTANT]
> This component requires `@mui/x-tree-view` (MIT-licensed, free community edition) as a peer dependency, in addition to `@mui/material`. Install it alongside your other MUI packages: `npm install @mui/x-tree-view`.

---

## 1. Import Reference

```tsx
import { Tree } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Tree } from "@recursica/mui-adapter";

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
- `expandOnClick` (default `true`) controls whether clicking a row's content also expands/collapses it (vs. only clicking its chevron); `selectOnClick` (default `true`) controls whether selection is enabled at all. See **Known Constraints** below for how these map onto the underlying library.

---

## 4. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 5. Known Constraints

- **`expandOnClick`/`selectOnClick` are approximated, not exact.** Setting `selectOnClick={false}` disables selection entirely, rather than only suppressing selection on a content click while leaving some other path available for selecting a node.
- No checkbox/multi-check styling is exposed — `@mui/x-tree-view` supports checkbox selection, but Recursica's `tree` design tokens don't yet define a checked visual state, so it isn't part of the Recursica API.
- No per-node `disabled` state — the Figma UI Kit tokens don't define one, and `RecursicaTreeNode` has no `disabled` field either.
