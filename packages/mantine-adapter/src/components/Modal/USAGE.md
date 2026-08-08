# Modal - Usage Guide

This document describes how to integrate and use the `Modal` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Modal } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Modal } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Modal opened={isOpen} onClose={close} title="Modal Title">
      <Text>This is a styled Modal wrapping the native primitive.</Text>
    </Modal>
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

## Architecture

`Modal` wraps Mantine's `<Modal>` component. Native Mantine styling props (`size`, `radius`, `shadow`) are not used — appearance and sizing are fully controlled by the design system tokens instead.

## Limitations & Structural Decisions

### 1. Stripped `size` Prop

Mantine natively exposes an abstract `size` prop (`"sm" | "md" | "lg" | "xl"`) that scales the Modal geometry. The Recursica UI Kit explicitly dictates strict geometric bounding boxes: `max-width: 960px` and `min-width: 304px`. To enforce absolute parity with the design system, the `size` prop has been intentionally omitted from the component's interface. The width of the Modal will scale fluidly strictly between these Figma-driven pixel limits.

### 2. Scroll Dividers

When the modal's content overflows and becomes scrollable, a divider line automatically appears, styled using the design system's scroll-divider color and thickness tokens.
