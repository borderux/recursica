# Popover - Usage Guide

This document describes how to integrate and use the `Popover` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Popover } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Popover } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Popover position="bottom" withArrow>
      <Popover.Target>
        <Button>Open Popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">This is the popover content.</Text>
      </Popover.Dropdown>
    </Popover>
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

### Composition

`Popover`, `Popover.Target`, and `Popover.Dropdown` are used together the same way as in Mantine: `Popover.Target` wraps the trigger element and applies no styling of its own, while `Popover.Dropdown` renders the styled panel content.

### Beak (Arrow)

The Recursica prop `withBeak` (defaulting to `true`) controls whether the pointer beak is shown, and maps to Mantine's `withArrow`. Both `withBeak` and `withArrow` are accepted; `withBeak` takes precedence. An `arrowSize` prop is also available (default `16`) to size the beak.

### Default Position

Recursica defaults `position` to `"top"` rather than Mantine's `"bottom"`. Pass your own `position` value to override it.
