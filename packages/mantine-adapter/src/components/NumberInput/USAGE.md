# NumberInput - Usage Guide

This document describes how to integrate and use the `NumberInput` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { NumberInput } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { NumberInput } from "@recursica/mantine-adapter";

export default function Demo() {
  return <NumberInput label="Quantity" min={1} max={10} defaultValue={1} />;
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

## 1. Native Macro Wrapper Bypass

**Decision:** The `<NumberInput>` component explicitly bypasses Mantine's native `Input.Wrapper` DOM injections.
**Implementation:** We pass `label={undefined}`, `description={undefined}`, and `error={undefined}` directly into the primitive `<MantineNumberInput>`. All visual form control geometry is delegated exclusively to our unified `<FormControlWrapper>`, ensuring 100% token adherence for label spacing and assistive text styling without duplicate DOM rendering.

## 2. Right Section & Controls Override

**Decision:** Passing a `rightSection` element will natively remove the increment/decrement arrow controls.
**Implementation:** Mantine inherently renders its stepper controls inside the `rightSection` DOM slot. Providing a custom right-aligned icon or text element intentionally overwrites this slot. If a layout strictly requires both a custom right-aligned element and the stepper controls simultaneously, the integrator must manually rebuild the arrows using Mantine's `handlersRef` within a custom right-section wrapper.

## 3. Controls Styling

**Decision:** The increment/decrement control arrows rely partially on native Mantine CSS inheritance.
**Implementation:** The current Recursica design system tokens do not provide explicit UI styling parameters (`background`, `border`, `hover` states) for the inner number-input arrows. We have explicitly removed Mantine's default borders to cleanly nest them inside the unified input box, and mapped the icon colors to the generic `trailing-icon` token variable, but further visual configurations currently fall back to Mantine defaults.
