# Link - Usage Guide

This document describes how to integrate and use the `Link` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Link } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Link } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Link href="/dashboard" variant="inline">
      Go to Dashboard
    </Link>
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

## States in Design Tokens

The design tokens (`recursica_variables_scoped.css`) provide the base link styling directly on `--recursica_ui-kit_components_link_properties_*` (no distinct `default` state), plus a `visited` variant that overrides only `colors_text-color`/`colors_icon-color`. There is no per-state token for `hover` anymore (a prior schema version had one); the component currently applies no distinct hover treatment beyond the browser's native `cursor: pointer`. There are no tokens for `active` or `focus` either; the component relies on the browser's default focus outline for accessibility unless overridden by a global reset.

## Overriding Mantine's underline Prop

Mantine's `Anchor` component uses `underline="hover"` by default. Because our design system specifies exact `text-decoration` styles via CSS tokens, we explicitly pass `underline="never"` to the underlying Mantine component. This prevents Mantine from injecting its own text-decoration inline or via generic classnames, ensuring our scoped CSS remains the single source of truth.

## Base Layout

Mantine's `Anchor` renders an inline element by default and does not natively support `leftSection` like the `Button` component. To support an optional `icon` alongside the text, we enforce a baseline layout of `display: inline-flex` and `align-items: center` in `Link.module.css`.

When an icon is present, the component conditionally passes a `data-has-icon` attribute to the root element. The CSS module uses this attribute to apply the `icon-text-gap` token via the CSS `gap` property.

## Inner Wrappers

The icon and children are wrapped in internal `<span>` tags (`.iconWrapper` and `.labelText` respectively). This follows the component development guide for structural robustness, allowing us to enforce specific sizing on the icon and intrinsic text truncation behavior if the link is placed in a bounded container.
