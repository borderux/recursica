# Card - Usage Guide

This document describes how to integrate and use the `Card` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Card } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Card } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Card>
      <Card.Header>
        <Heading order={3}>Card Title</Heading>
      </Card.Header>
      <Card.Content>
        <Text>
          This is some card content styled natively via design tokens.
        </Text>
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Submit</Button>
      </Card.Footer>
    </Card>
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

## Header & Footer Styling

`Card.Header` and `Card.Footer` automatically receive their background color and padding from the design system; no manual styling is needed.

## Layout Alignment

`Card` accepts a safe subset of flexbox/sizing props (`flex`, `flexGrow`, `flexShrink`, `flexBasis`, `grow`, `h`, `height`) so it can participate cleanly in flex or grid layouts (dashboard panels, grid tracks, sidebar segments, etc.). `Card.Content` grows to fill available vertical space, which keeps `Card.Footer` pinned to the bottom of the card.
