# Loader - Usage Guide

This document describes how to integrate and use the `Loader` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Loader } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Loader } from "@recursica/mui-adapter";

export default function Demo() {
  return <Loader size="md" />;
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

## Architecture & Integration

The `Loader` component for the MUI adapter has been completely hand-coded from scratch using pure CSS and basic HTML `<span>` elements. It explicitly **does not** use MUI's native `<CircularProgress>` component.

This was a deliberate architectural decision to ensure 100% feature and visual parity with the `mantine-adapter`.

### Key Decisions:

- **Bypassing Native Components:** MUI's native loaders (like `<CircularProgress>`) are built using complex animated SVGs and only support a circular "oval" shape. Since the Recursica design system mandates `oval`, `bars`, and `dots` variants, relying on MUI's primitives would have forced a fragmented architecture where `oval` used MUI but `bars` and `dots` were hand-coded.
- **Parity with Mantine:** To guarantee identical animation timing, easing curves, and DOM structures across frameworks, the CSS keyframes and layout strategies used internally by Mantine's `<Loader>` were extracted and directly replicated in this adapter's `Loader.module.css`.

### Token Mapping:

Sizes are bound through `data-size` attributes (`sm`, `md`, `lg` parsing to target `<div data-size="small">`, etc.).

- **Oval Variant:** Uses a CSS spinning `::after` pseudo-element. To avoid CSS border inheritance bugs when computing tokenized border-widths, a custom `--loader-thickness` CSS variable is used to bridge the token into the spinning element.
- **Bars & Dots Variants:** Render three internal `<span />` elements sequentially, styled via `Loader.module.css` to handle individual keyframe delays for bouncing or fading animations.

### Color Contrast Rules:

Loaders are hardcoded to map to their explicitly defined design tokens (e.g., `--recursica_ui-kit_components_loader_properties_indicator-color`). By default, they do **not** inherit `currentColor`.

When injected into components like the `Button` (where contrast issues may arise against solid backgrounds), it is the responsibility of the parent component (e.g., `Button.module.css`) to use contextual CSS overrides to force `--loader-color: currentColor !important` if necessary.
