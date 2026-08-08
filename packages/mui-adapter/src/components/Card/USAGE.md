# Card - Usage Guide

This document describes how to integrate and use the `Card` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Card } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Card } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Card>
      <Card.Header>
        <Title order={3}>Card Title</Title>
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

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

`Card.Header` and `Card.Footer` stretch edge-to-edge within the card. The root `Card` component also accepts a safe subset of flexbox/dimension props (`flex`, `flexGrow`, `flexShrink`, `flexBasis`, `grow`, `h`, `height`) so it can be sized properly alongside other elements in dynamic/flex layouts (such as dashboard panels, grid tracks, or sidebar layout segments). `Card.Content` grows to fill the available vertical space, keeping `Card.Footer` aligned to the bottom of the card.
