# Loader - Usage Guide

This document describes how to integrate and use the `Loader` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Loader } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Loader } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Loader size="md" />;
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

## Architecture & Integration

The `Loader` component acts as a strictly tokenized wrapper bridging the Recursica UI-Kit `loader` variables to the generic Mantine `@mantine/core` `Loader` primitive.

### Key Decisions:

- **Variant Mapping:** Recursica's `variant` directly proxies to Mantine's `type` prop for `"oval" | "bars" | "dots"`.
- **Property Overrides Disabled:** Natively overriding specific structural variants directly on the JSX interface like `thickness` and `borderRadius` has been intentionally omitted. Component rendering relies entirely on variables exposed by the underlying UI Kit mappings tied to the size prop.

### Token Mapping:

Sizes are bound through `data-size` attributes (`sm`, `md`, `lg` parsing to target `<div data-size="small">`, etc.).

Mantine natively sets sizing dynamically at the component root and parses thickness/variants differently natively (e.g., `oval` styles its geometry strictly via CSS `border`, while `bars` and `dots` utilize specific DOM inner spans `span.dot` / `span.bar`).

#### Specific CSS Targeting Hacks Used

- `border-width` and `border-radius` structurally style the `thickness` and `border-radius` configuration of the `oval` variant on the `::after` pseudo-element by resolving `--recursica_ui-kit_components_loader_variants_sizes_..._properties_thickness` and `_border-radius`.

### Unsupported Properties

- **xs and xl Sizing:** These sizes are explicitly unsupported in the Recursica standard logic (as surfaced in `filterStylingProps` and UI Kit mappings). Attempting to use them will safely default back or fallthrough statically unless defined later. See `COMPONENT_ISSUES.md`.
