# Button - Usage Guide

This document describes how to integrate and use the `Button` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Button } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Button } from "@recursica/mantine-adapter";

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

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogues style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.

---

## 4. Key Integration Features & Constraints

## Icon size: Recursica defines it

Icon size is **not** left to the developer. Recursica defines it via the design tokens, so callers cannot pass an arbitrarily sized icon — whatever is passed in `icon` is scaled to fit the token-defined dimensions for the button's size.

---

## Icon-only buttons: accessibility

When the button has an icon and no visible label (icon-only), callers must provide an accessible name via `aria-label` (e.g. `aria-label="Submit"`). In development, a console warning is logged if `icon` is set, `children` is empty, and `aria-label` is missing.

---

## Label truncation at max-width

When the button hits its Recursica max-width (500px), the label truncates with an ellipsis instead of wrapping.

---

## Disabled state: brand theme opacity (implicit)

**Decision:** The UI kit enforces global brand theme disabled opacities. The `.root:disabled` logic implicitly overrides visibility locally via `var(--recursica_brand_states_disabled)`.

---

## Loader color contrast

**Decision:** When a Button is in a loading state, the `Recursica Loader` component is injected. The `Loader` component strictly defines its own colors and styles per variant, meaning it does not inherit the text color (`currentColor`) from the Button.

**Constraint:** This can lead to contrast issues (e.g., a blue dots loader inside a solid blue button). Design has explicitly decided not to address this at the moment. As such, developers using the `loading` prop must be aware that the loader's color is fixed by its internal tokens, not by the button's context.

---

## Loading state enforces disabled state

When `loading={true}` is passed to the Button, it is also treated as disabled — the button cannot be interacted with while loading.
