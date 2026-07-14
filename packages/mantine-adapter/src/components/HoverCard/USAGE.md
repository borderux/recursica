# HoverCard - Usage Guide

This document describes how to integrate and use the `HoverCard` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { HoverCard } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { HoverCard } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <HoverCard>
      <HoverCard.Target>
        <Text>Hover over me</Text>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">This is the hover card popup content.</Text>
      </HoverCard.Dropdown>
    </HoverCard>
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

## 1. Composable API Preservation (1:1 Mapping)

**Decision:** We maintain the exact library composition API structure (`<HoverCard>`, `<HoverCard.Target>`, `<HoverCard.Dropdown>`) as a 1:1 React component mapping.

**Implementation:** Mantine's HoverCard internally manages hover detection, open/close delays, Floating UI positioning, and portal rendering. By preserving the exact sub-component tree, Recursica safely inherits all of these behaviors without reimplementation.

---

## 2. HoverCard.Target Pass-Through

**Decision:** `HoverCard.Target` is a transparent pass-through with no styling applied.

**Implementation:** The target wrapper exists solely to manage Mantine's ref forwarding and hover event binding for the trigger element. No `filterStylingProps` or CSS module classes are applied — the trigger's appearance is entirely controlled by whatever component the integrator places inside it (e.g., `<Button>`). This is identical to the `Menu.Target` pattern.

---

## 3. Token Namespace: `hover-card-popover`

**Decision:** The CSS module exclusively uses variables from the `--recursica_ui-kit_components_hover-card-popover_*` namespace.

**Implementation:** The Recursica token system defines a single shared namespace (`hover-card-popover`) for this component covering geometry (border-radius, border-size, padding, min/max-width), typography (content-text\_\*), elevation, and layer-aware colors (background, border-color, content). No tokens from other component namespaces are referenced.

---

## 4. Hardcoded Values

**Decision:** Two hardcoded values exist in the component.

### `border-style: solid` (CSS module)

Mantine renders the dropdown using its `Paper` component, which does not set `border-style` natively. Without this hardcoded value, the border-width and border-color tokens would have no visible effect. This is the same pattern used in the Menu component's dropdown.

### `arrowSize` defaulted to `16` (HoverCard.tsx)

Mantine's `arrowSize` prop is a JavaScript number used for inline style calculations: it sets `width`, `height`, and a positioning offset (`-arrowSize/2`) directly on the arrow `<div>` element. These inline styles **cannot** be overridden via CSS without `!important`, and the positioning offset has no CSS equivalent. This means the beak size cannot be fully CSS-driven — it is one of the rare cases where a design token value must be mirrored as a JS prop.

The default value `16` matches the Recursica `beak-size` token (`--recursica_ui-kit_components_hover-card-popover_properties_beak-size: 16px`). Developers can override `arrowSize` if needed, but should be aware this is a design system concern. If the token value changes, the default in `HoverCard.tsx` must also be updated.

This is documented as an open issue in `docs/COMPONENT_ISSUES.md`.

**Note:** Mantine calls this the "arrow"; Recursica calls it the "beak". The Recursica prop `withBeak` (defaulting to `true`) maps to Mantine's `withArrow`. Both `withBeak` and `withArrow` are accepted; `withBeak` takes precedence.

---

## 5. Minimal CSS Override Philosophy

**Decision:** The CSS module only overrides visual design tokens (colors, typography, spacing, borders, shadows). All structural layout properties are deferred to Mantine's native behavior.

**Implementation:** HoverCard is an overlay component where Mantine's native Floating UI positioning and Paper layout are already correct. We avoid setting:

- `overflow` on the dropdown (Mantine handles scroll behavior natively)
- `display`, `position`, `z-index` (Floating UI controls these)
- `pointer-events` (Mantine manages hover detection across target and dropdown)

**Rationale:** The Menu implementation demonstrated that aggressive structural resets (overflow, box-sizing) on overlay components cause layout breakage. Default to Mantine's native behavior and only override what the Recursica token system explicitly needs to control.

---

## 6. ClassNames Merging on Root

**Decision:** The root `HoverCard` component binds CSS module classes via `classNames` on the Mantine root, identical to the Menu pattern.

**Implementation:** The root component receives `classNames={{ dropdown: styles.dropdown }}` and merges any consumer-provided `classNames` when `overStyled` is true. This ensures our token-driven styles are applied to the dropdown panel without wrapper divs, and the consumer's classes are additive.

---

## 7. Default Position Override

**Decision:** Recursica defaults `position` to `"top"`. Mantine defaults to `"bottom"`.

**Implementation:** The `position="top"` default is set on the Mantine root element before the prop spread, so developer-provided `position` values still take precedence. This aligns with Recursica's design intent for overlay components to appear above their trigger by default.
