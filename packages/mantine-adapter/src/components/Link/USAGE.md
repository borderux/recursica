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

## Underline Behavior

`Link` does not use Mantine's automatic hover-underline behavior; text decoration is fully controlled by the design system's tokens.

## Icon Support

When an `icon` is provided, it renders alongside the link text with spacing between them applied automatically via design tokens.
