# Pagination - Usage Guide

This document describes how to integrate and use the `Pagination` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Pagination } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Pagination } from "@recursica/mui-adapter";

export default function Demo() {
  return <Pagination total={10} value={activePage} onChange={setPage} />;
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

- **Compositional API Dropped:** Mantine's original `Pagination` component relies heavily on dot-notation sub-components (`Pagination.Root`, `Pagination.Items`, `Pagination.Control`, etc.). MUI's `<Pagination>` is fundamentally monolithic. Following architectural review, we have decided to drop the dot-notation wrappers for `mui-adapter` and rely strictly on MUI's monolithic API. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.
