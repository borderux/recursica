# TextArea - Usage Guide

This document describes how to integrate and use the `TextArea` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { TextArea } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { TextArea } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <TextArea label="Comments" placeholder="Leave your comments here..." />
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

The `TextArea` component is mapped explicitly to Mantine's `<Textarea>` following the same strict encapsulation rules as `TextField`.

1. **Naked Primitive Mapping:** Mantine's `Textarea` natively executes macro-label generation. To decouple it, we explicitly disable internal labels (`label={undefined}`) and inject it purely inside our generic `FormControlWrapper`.
2. **Text Field Token Re-Use:** Because text areas fundamentally share the same box-geometry, text, and state definitions as single-line inputs, it strictly implements the `--recursica_ui-kit_components_text-field_...` variables natively.
3. **Autosize Handling:** The component supports Mantine's raw `autosize`, `minRows`, and `maxRows` parameters out of the box dynamically via property passthrough.
