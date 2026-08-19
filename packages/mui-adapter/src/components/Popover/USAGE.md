# Popover - Usage Guide

This document describes how to integrate and use the `Popover` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Popover } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Popover, Button, Text } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Popover position="bottom" withBeak>
      <Popover.Target>
        <Button>Open Popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="rec-sm">This is the popover content.</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
```

---

## 3. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

### Composition

`Popover`, `Popover.Target`, and `Popover.Dropdown` are used together: `Popover.Target` wraps the trigger element and applies no styling of its own, while `Popover.Dropdown` renders the styled panel content. Both `Popover.Target` and `Popover.Dropdown` are required — omitting either throws.

### Open/close behavior

The dropdown opens when the user clicks the target and closes on an outside click, on Escape, or by clicking the target again. Use `opened`/`onChange` for controlled usage, or `defaultOpened` to set the initial uncontrolled state.

### Beak (Arrow)

The Recursica prop `withBeak` (defaulting to `true`) controls whether the pointer beak is shown.

### Position

`position` accepts the same 12 placement values as `HoverCard`/`Tooltip` (e.g. `"top"`, `"bottom-start"`, `"right-end"`) and defaults to `"top"`.

### Width

An optional `width` prop sets a fixed width on the dropdown panel.
