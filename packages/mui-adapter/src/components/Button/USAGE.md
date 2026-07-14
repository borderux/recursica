# Button - Usage Guide

This document describes how to integrate and use the `Button` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Button } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Button } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Button variant="primary" onClick={() => console.log("Clicked!")}>
      Click Me
    </Button>
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

## Loader color contrast

**Decision:** When a Button is in a loading state, the `Recursica Loader` component is injected via the `loadingIndicator` prop. The `Loader` component strictly defines its own colors and styles per variant, meaning it does not automatically inherit the text color (`currentColor`) from the Button.

**Constraint:** This can lead to contrast issues (e.g., a blue dots loader inside a solid blue button). Design has explicitly decided not to address this at the moment. As such, developers using the `loading` prop must be aware that the loader's color is fixed by its internal tokens, not by the button's context.

---

## Loading state enforces disabled state

**Decision:** When `loading={true}` is passed to the Button, the component explicitly forces `disabled={true}` natively on the underlying element.

**Implementation:** This ensures that loading buttons automatically inherit the brand theme disabled opacities (via the `:disabled` CSS pseudo-class) rather than relying solely on MUI's internal loading opacity adjustments.
