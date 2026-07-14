# Avatar - Usage Guide

This document describes how to integrate and use the `Avatar` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Avatar } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Avatar } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Avatar src="https://example.com/avatar.png" alt="User Name" radius="xl" />
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

## Architecture Decisions

The `Avatar` component is an adapter over Mantine's `Avatar`. To ensure adherence to the `COMPONENT_GUIDE_WALKTHROUGH.md`:

- We do not wrap `MantineAvatar` in any custom standard `div` elements, preserving DOM structure.
- All styles strictly pull from explicit `--recursica_ui-kit_components_avatar_*` CSS tokens.

## Structural Workarounds

### Implicit `data-style`

Mantine's Avatar implicitly renders an image, an icon, or a text node based on the properties passed (`src`, `var`, `children`).
Recursica Tokens split Avatar styling distinctly across three separate categories: `image`, `icon`, and `text`.
To correctly map these variables, our React component observes standard prop states and manually injects a `data-style="image|icon|text"` onto the root. The `Avatar.module.css` explicitly gates padding and generic sizing modifiers under these `data-style` attributes.

### Flex Layout & Internal Spans

Since Avatar children (icons or initials) require robust centering that might differ heavily across Recursica size mappings, all child content defaults to being wrapped in `span` elements (either `.textWrapper` or `.iconWrapper`). These spans enforce 100% height and flex formatting independent of the Mantine container constraints.

### CSS Reset Hacks

Noticeable `/* HARDCODE: ... */` hacks are deployed within `.root` to completely zero-out Mantine's `--avatar-bg` and internal variables statically since Recursica handles background-colors inherently via the CSS variants cascade.
