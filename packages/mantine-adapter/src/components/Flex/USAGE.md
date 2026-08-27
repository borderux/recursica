# Flex - Usage Guide

This document describes how to integrate and use the `Flex` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Flex } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Flex } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Flex gap="md" justify="space-between" align="center">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </Flex>
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

The `Flex` component is a generic unopinionated flex layout wrapper mapped directly to Mantine's `Flex`.
All spacing props (`gap`, `align`, `justify`, `direction`, `wrap`) pass through as normal, with `rec-` dimension tokens mapped transparently to standard gap values.

---

## 5. Responsive Layout Props

Every layout prop (`direction`, `align`, `justify`, `wrap`, `gap`, `rowGap`, `columnGap`, and the Mantine dimension props like `w`/`h`/`maw`) accepts either a single value or a per-breakpoint object. Breakpoint keys are `base` (smallest / default), `xs`, `sm`, `md`, `lg`, `xl`.

```tsx
<Flex
  direction={{ base: "column", xl: "row" }}
  gap={{ base: "rec-sm", xl: "rec-xl" }}
  align={{ base: "stretch", xl: "center" }}
>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Flex>
```

`rec-` dimension tokens are mapped transparently inside responsive objects too, so `gap={{ base: "rec-sm", xl: "rec-xl" }}` resolves each breakpoint to the corresponding gap value.

The breakpoint values themselves come from your Mantine theme (`theme.breakpoints`), so overriding them in your `MantineProvider` applies here automatically. Custom breakpoint _names_ added via Mantine's `MantineThemeSizesOverride` module augmentation are accepted as keys as well (e.g. `direction={{ base: "column", xxl: "row" }}`), mirroring Mantine's own responsive props.
