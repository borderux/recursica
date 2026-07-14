# ReadOnlyField - Usage Guide

This document describes how to integrate and use the `ReadOnlyField` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { ReadOnlyField } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { ReadOnlyField } from "@recursica/mantine-adapter";

export default function Demo() {
  return <ReadOnlyField label="API Key" value="sk_test_123456789" copyable />;
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

## 1. Stripping Mantine Assumptions

Unlike standard input variables, standard HTML output `<p>` tags inherently carry margin and spacing assumptions from core browser stylesheets. To correctly map `ReadOnlyTextField` elements gracefully inside the generic `FormControlWrapper` bounded context, we hardcode resets:

- `margin: 0` explicitly strips block flow gap so `FormControlWrapper` handles vertical rhythm.
- `min-height`: Native `Input` boxes typically have baseline padding borders. We map directly to `var(--recursica_ui-kit_components_read-only-field_properties_min-height)` to ensure a side-by-side editable `TextField` and `ReadOnlyField` perfectly share roughly identical visual heights.

## 2. Unidirectional Editable Mode

The main wrapper intercepts `readOnly` boolean blocks, maintaining its own `isReadOnly` state. Natively, if a user clicks an exposed 'Edit' action (like our legacy SVG or custom `labelActionArea`), the context permanently switches to active.
There is intentionally no built-in reverse toggle inside typical field bindings (like input "Blur") to revert state. Parents must pass external controls to `readOnly` forcing the internal hooks to reset via standard `useEffect` propagation.
