# Accordion - Usage Guide

This document describes how to integrate and use the `Accordion` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Accordion } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Accordion } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <Accordion>
      <Accordion.Item value="item-1">
        <Accordion.Control>Section 1</Accordion.Control>
        <Accordion.Panel>Section 1 content</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
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

## 1. Hybrid Composition API (Smart Rendering Flow)

**Decision:** We fundamentally maintain the exact library composition API structure (`<Accordion>`, `<Accordion.Item>`, `<Accordion.Control>`, `<Accordion.Panel>`) while actively supporting an auto-completing flattened prop schema matching the unified Recursica API (`title`, `leftIcon`, `divider`).
**Implementation:** Avoid rigid raw parameter dumps. Mantine dynamically injects explicit `id` logic, keyboard ARIA mapping, and focus tracking correctly across `Control` to `Panel` DOM connections natively. By exposing the hierarchical mapping 1:1, Recursica safely adopts these capabilities. However, to strictly support Recursica's unified prop mapping interface:

- **Auto-Construction:** If integrators natively pass `title` and/or `leftIcon` props into `<AccordionItem>`, the component structurally auto-generates the internal `AccordionControl` sub-wrappers mapping the text and SVG natively, whilst treating `children` implicitly as the Panel contents.
- **Graceful Falldown:** If `title` is heavily omitted, the node immediately falls backward into raw Mantine composability expecting integrators mapped `<Accordion.Control>` entirely manually.

---

## 2. Default Configuration Reset (`unstyled`)

**Decision:** We strip Mantine's inner styles away completely from Accordion mappings by leveraging React's default `variant="unstyled"`.
**Implementation:** In `Accordion.tsx`, `<MantineAccordion>` binds `variant="unstyled"`. This effectively deletes Mantine's precomputed padding, borders, and shadow mappings allowing our targeted `classNames` inside `Accordion.module.css` to become the exact source of foundational truth without "fighting" `!important` tags or unpredictable flex-layouts inherited globally.

---

## 3. Strict SVG Icons Wrapper (`.iconLeftWrapper`)

**Decision:** Identical logic enforced as seen within Buttons: SVG scales dynamically inside `.mantine-leftSection` based on SVGs internal definition boundaries potentially corrupting header gaps.
**Implementation:** `AccordionControl` captures `<span className={styles.iconLeftWrapper} aria-hidden>` forcing `object-fit: contain` mapped exactly to the `properties_icon-left-size` Recursica dimension token forcing integrator SVG overrides inline perfectly.

---

## 4. Transparent Global Hover Fixes

**Decision:** We nullify internal Mantine button hover actions and exclusively utilize Recursica's hover structure natively.
**Implementation:** We construct `.control::after` pseudo-objects dynamically pulling our `hover-color` & `hover-opacity` bindings. Mantine's native action sets `.control:hover { background-color: var(...) }` dynamically causing internal layer overlaps. We enforce `background-color: transparent` strictly overriding it, preserving our pseudo-overlay layer-cascade cleanly.

---

## 5. Active Target Hooks (`[data-active]`)

**Decision:** Collapsed and expanded state tracking requires separate background maps across `AccordionItem`.
**Implementation:** Rather than syncing React `useState` hooks matching `Accordion.value`, we defer to Mantine's inherent DOM mapping: `.item[data-active]` implicitly triggers exactly when Mantine registers an expansion state swap changing values down dynamically on the element layer, perfectly binding to `--recursica_..._background-expanded`.

---

## 6. Nullifying Isolated State Bounds (`open` boolean)

**Decision:** We do not bind isolated `open={true}` state properties natively on individual `<AccordionItem>` configurations.
**Implementation:** Recursica natively dictates an item-level `open` tracking mapping. However, internally mapping boolean flags structurally across specific tree nodes heavily corrupts Mantine's DOM layout algorithms mapping parent-driven transition listeners. Mantine forces all expanded-height logic to run symmetrically off the `<Accordion value="...">` string matching array to accurately bind ARIA transitions. We explicitly ignore isolated item `<AccordionItem open={...}>` booleans to shield the rendering sequence cleanly.
