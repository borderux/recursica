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

## Architecture Overrides

Because MUI natively constructs `Card` bounding boxes using `<Paper>` components (which lack the precise edge-to-edge layouts native to Mantine's sections), we implemented custom margins for edge-to-edge section components:

- `<Card.Header>` explicitly hooks `--recursica_ui-kit_components_card_properties_header-background` and corresponding padding variables, stretching edge-to-edge via negative margin resets.
- `<Card.Footer>` explicitly hooks `--recursica_ui-kit_components_card_properties_footer-background` and corresponding padding variables.

## Layout Alignment Exceptions

To allow Cards to fit cleanly inside dynamic/flex layouts (like dashboard panels, grid tracks, or sidebar layout segments), the Card wrapper implements a custom gatekeeper bypass for outer styling properties:

- Exposes a safe subset of flexbox/dimensions styling properties (`flex`, `flexGrow`, `flexShrink`, `flexBasis`, `grow`, `h`, `height`) on the root `<Card>` component to allow proper sizing alongside layout siblings.
- Sets `<Card.Content>` to `flex-grow: 1;` by default via CSS modules. Since the root `<Card>` has `display: flex; flex-direction: column;`, this makes the content area expand to fill all vertical space, pushing `<Card.Footer>` to align at the absolute bottom of the bounding box.
