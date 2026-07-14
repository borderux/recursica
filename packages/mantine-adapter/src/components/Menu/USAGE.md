# Menu - Usage Guide

This document describes how to integrate and use the `Menu` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Menu } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Menu } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Menu>
      <Menu.Target>
        <Button>Toggle Menu</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item color="red">Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
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

**Decision:** We maintain the exact library composition API structure (`<Menu>`, `<Menu.Target>`, `<Menu.Dropdown>`, `<Menu.Item>`, `<Menu.Divider>`, `<Menu.Label>`, `<Menu.Sub>`, `<Menu.Sub.Target>`, `<Menu.Sub.Item>`, `<Menu.Sub.Dropdown>`) as a 1:1 React component mapping.

**Implementation:** Mantine's Menu internally manages WAI-ARIA role assignments (`role="menu"`, `role="menuitem"`, `aria-haspopup`, `aria-expanded`, `aria-controls`), keyboard navigation (arrow keys, Enter, Escape), and focus trapping natively across its composable hierarchy. By preserving the exact sub-component tree, Recursica safely adopts all of these accessibility behaviors without reimplementation.

---

## 2. Hover State Overlay Technique

**Decision:** We nullify Mantine's native hover background on `Menu.Item` and exclusively utilize Recursica's hover structure via a `::after` pseudo-element overlay.

**Implementation:** The `.item::after` pseudo-object dynamically pulls `hover-color` & `hover-opacity` bindings from the Recursica token system. Mantine natively changes `background-color` on item hover which would override our token-driven colors. We enforce `background-color` to remain the unselected-item background on hover, then layer our pseudo-overlay on top. This is the same technique used in the Accordion component.

---

## 3. Selected vs Unselected Item States

**Decision:** Menu items map to Recursica's `selected-item` and `unselected-item` color token groups.

**Implementation:** The CSS module defaults all items to `unselected-item_*` tokens (background, text, opacity). Items with `[data-selected]` switch to `selected-item_*` tokens. This mapping is natively driven by Mantine's internal state tracking without React state hooks.

---

## 4. `color` Prop Stripping

**Decision:** Mantine's `color` prop on `Menu.Item` (used for semantics like "danger/red") is explicitly stripped in strict mode.

**Implementation:** The `color` prop is deleted from the sanitized props when `overStyled` is `false`. This enforces strict design token adherence — all item colors come from the CSS module referencing Recursica variables. Developers requiring custom color semantics must either:

1. Use `overStyled={true}` as an explicit escape hatch
2. Contribute a proper Recursica variant to the token system

**Rationale:** The Recursica token set does not currently include danger-specific or semantic-color variants for menu items. Allowing arbitrary `color` values would break design system consistency.

---

## 5. Menu.Target Pass-Through

**Decision:** `Menu.Target` is a transparent pass-through with no styling applied.

**Implementation:** The target wrapper exists solely to manage Mantine's ref forwarding and event binding for the trigger element. No `filterStylingProps` or CSS module classes are applied — the trigger's appearance is entirely controlled by whatever component the integrator places inside it (e.g., `<Button>`).

---

## 6. Sub-Menu Support

**Decision:** We wrap the full Mantine sub-menu hierarchy (`Menu.Sub`, `Menu.Sub.Target`, `Menu.Sub.Item`, `Menu.Sub.Dropdown`).

**Implementation:** Sub-menu components inherit the same CSS module classes as their top-level counterparts since the Recursica token set does not distinguish sub-menu-specific styling. `Menu.Sub.Item` also strips the `color` prop in strict mode, consistent with `Menu.Item`. The sub-menu dropdown portal inherits the same `classNames` from the root Menu's `classNames` mapping.

---

## 7. Dropdown Container Padding

**Decision:** The dropdown container uses `divider-item-gap` as its internal padding.

**Implementation:** This ensures consistent spacing between the dropdown border and its content items. The gap token (`4px` by default) creates a subtle inset that visually separates items from the container edge, matching the Figma design specifications.

---

## 8. Minimal CSS Override Philosophy

**Decision:** The CSS module only overrides visual design tokens (colors, typography, spacing, borders, shadows). All structural layout properties (flex, cursor, pointer-events, box-sizing, etc.) are deferred to Mantine's native behavior.

**Implementation:** Unlike form-field components (e.g., Dropdown/TextField) which require deep structural overrides to strip Mantine's macro wrappers, the Menu is an overlay component where Mantine's native layout is already correct. We avoid setting:

- `overflow` on the dropdown (Mantine renders sub-menu dropdowns inside the parent DOM tree using Floating UI absolute positioning — setting overflow clips them)
- `display`, `align-items`, `width`, `cursor` on items (Mantine's button-based items already handle this)
- `pointer-events` on disabled items (Mantine handles disabled natively)

**Rationale:** Early iterations included aggressive structural resets (like `overflow: hidden`, `box-sizing: border-box`, `margin: 0`) cargo-culted from the Dropdown component. These caused sub-menus to render clipped inside the parent dropdown with scrollbars. The lesson: default to Mantine's native behavior and only override what the Recursica token system explicitly needs to control.
