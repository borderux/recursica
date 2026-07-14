# Dropdown - Usage Guide

This document describes how to integrate and use the `Dropdown` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Dropdown } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Dropdown } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Dropdown placeholder="Select an option">
      <Dropdown.Item value="1">Option 1</Dropdown.Item>
      <Dropdown.Item value="2">Option 2</Dropdown.Item>
    </Dropdown>
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

The `Dropdown` component is mapped explicitly to Mantine's `<Select>` following the exact same strict encapsulation rules as `TextField`.

1. **Naked Primitive Mapping:** Mantine's `Select` natively executes macro-label generation. To decouple it, we explicitly disable internal labels (`label={undefined}`) and inject it purely inside our generic `FormControlWrapper`.
2. **Strict Dropdown Design Tokens:** The adapter implements strictly sandboxed styling utilizing only `--recursica_ui-kit_components_dropdown_...` variables. It explicitly does NOT inherit general `text-field` tokens despite geometric similarities, ensuring dropdown menus can be themed independently.
3. **Dropdown Appendages:** To correctly map Mantine's detached Popover `.dropdown` and list `.option` items, we targeted focus and geometric bindings appending standard padding structures matched to the dropdown height overrides dynamically into our `Dropdown.module.css`.
