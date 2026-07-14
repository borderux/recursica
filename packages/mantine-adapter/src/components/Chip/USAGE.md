# Chip - Usage Guide

This document describes how to integrate and use the `Chip` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Chip } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Chip } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Chip defaultChecked>Clickable Chip</Chip>;
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

## Architecture decisions

### Mantine DOM Structure & Label Overrides

Mantine's `<Chip>` behaves like an input element (`radio` or `checkbox`). Under the hood, it renders:

1. `.mantine-Chip-root` (wrapper)
2. `input` (hidden visual structure)
3. `.mantine-Chip-label` (The actual visible button-like pill)

Because the `.label` is the primary visual surface and handles Mantine's built-in `:hover` and active states, we direct our Recursica styling natively to `.label`.

### Icon and Remove Implementations

To achieve this without breaking Mantine's `Chip` input architecture, we wrapped the internal `children` using a standard `span` DOM strategy:

```tsx
<span className={styles.innerWrapper}>
  {icon}
  <span className={styles.children}>{children}</span>
  {onRemove}
</span>
```

#### Intermediate Children Wrapper Span display fix:

Mantine internally wraps the children passed to `Chip` in a default `<span>` which has `display: inline`. This intermediate `span` inherits the `line-height` of the `.label` container, causing the computed height of the Chip to be ~2px taller than expected. To address this, `.label > span:not(.mantineIconWrapper)` is targeted to force `display: inline-flex; align-items: center;` on that intermediate wrapper `span`, allowing it to collapse perfectly to the `16px` height of the `innerWrapper`.

### Accessibility of Remove Action

Because the Chip fundamentally functions as a `<label>` linked to an `<input>`, placing a raw interactive element like `<button>` directly inside the standard Chip sub-tree violates nested interactive element ARIA constraints in strict validators.
To accommodate this, the visual "close" icon uses a `<span>` element configured with `role="button"` and `tabIndex={0}` to hook into standard keyboard activations without triggering generic nested `<form>` conflicts native to Mantine's baseline constraints.

### Removing Sizing Properties

During implementation, the parsed Figma design tokens natively exported specific height/padding vectors dynamically (e.g., `--recursica_ui-kit_components_chip_properties_icon-size`) rather than explicit string variants (`sm`, `md`, `lg`). Therefore, we omitted `size` conceptually from the `RecursicaChipProps` wrapper to lock down size evaluation natively against the active layer variables.
