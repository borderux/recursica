# Pagination - Usage Guide

This document describes how to integrate and use the `Pagination` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Pagination } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Pagination } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Pagination total={10} value={activePage} onChange={setPage} />;
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

## Architecture Decision: CSS Inheritance vs. Composition

The Figma design tokens for the `Pagination` component dictate that pagination pages perfectly mimic `Button` variants (e.g. `active-pages_style: "solid"`, `inactive-pages_style: "outline"`, `navigation-controls_style: "text"`).

As of the `1.2.0` scoped CSS update, the Figma exporter automatically handles these variants. It flattens and aliases the referenced Button properties directly into the `Pagination` component's variable namespace.

We opted to use Mantine's native `PaginationControl` components to ensure all DOM structure, focus management, and accessibility attributes are preserved natively without us needing to carefully rebuild `Pagination.Items` mappings.

To honor the Figma design intents while using Mantine's raw `<button>` elements:

1. We inherit and map all natively scoped `Pagination` variant styles (small typography, outline/solid/text colors, and hover overlays) directly into `.control` and `.control[data-active]` within `Pagination.module.css`. We do not need to manually reference `Button` variables cross-component.
2. We inject `data-variant="text"` via `getControlProps` onto the navigation buttons so that they inherit the explicitly aliased text style variables (`navigation-controls`) defined by the UI Kit for pagination.

This achieves exact optical alignment with the tokens while maintaining Mantine's robust internal event handling for pagination.
