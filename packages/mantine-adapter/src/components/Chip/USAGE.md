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

### Accessibility of Remove Action

The remove/close action is keyboard accessible — it can be activated via keyboard as well as mouse click.

### Sizing

Chip does not support a `size` prop; chips render at a fixed size.

### Building a keyboard-navigable chip group

`removeTabIndex` and `removeIconRef` are optional escape hatches for composing a _group_ of chips
with roving-tabindex keyboard navigation (Tab reaches one chip at a time, arrow keys move between
them) — see `FileUpload`'s file list for a working example. Ignore both for a standalone chip; they
default to a normal `tabIndex={0}` remove icon with no ref.
