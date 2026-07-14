# Stepper - Usage Guide

This document describes how to integrate and use the `Stepper` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { Stepper } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Stepper } from "@recursica/mui-adapter";

export default function Demo() {
  return (
    <Stepper active={1}>
      <Stepper.Step label="First step" description="Create account" />
      <Stepper.Step label="Second step" description="Verify email" />
    </Stepper>
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

- **Compositional API Dropped:** Mantine manages stepper state and content via `<Stepper.Step>` and `<Stepper.Completed>`. MUI delegates content rendering to the developer and focuses purely on the stepper visual layout using `<Step>`, `<StepLabel>`, etc.
- **Monolithic API Adopted:** Following architectural review, we have abandoned the fabricated context wrappers for `mui-adapter`. We now natively export `Stepper`, `Step`, `StepLabel`, `StepButton`, and `StepConnector` wrapping their `@mui/material` counterparts. Developers are expected to manage the active step logic and content rendering outside the `Stepper` component, consistent with MUI patterns. Storybook tests have been updated to reflect this divergence while retaining core visual compatibility.
