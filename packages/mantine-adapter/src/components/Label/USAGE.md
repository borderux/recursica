# Label - Usage Guide

This document describes how to integrate and use the `Label` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Label } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Label } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Label required>Field Label</Label>;
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

## Architecture Overview

The `Label` component is fundamentally built as a strict, localized wrapper around Mantine's native `Input.Label`. The core goal is to preserve context, ref-forwarding, and native accessibility links, while completely overriding visual behaviors via Recursica design variables in scoped CSS.

## Key Design Decisions

### **Layout Architecture**

- Because Recursica dictates complex alignments between primary label text, asterisks, edit icons, and optional strings, Mantine's rigid form label flow could not be used out-of-the-box.
- Implemented `display: flex; flex-wrap: wrap;` directly on `.root`.
- Injected strict integer-based flex `order` properties (e.g. `order: 1` for text, `order: 2` for `required`, `order: 5` for `optionalText`) to physically decouple DOM rendering from markup flow.
- Because `optionalText` often acts as secondary contextual detail, it forces `flex-basis: 100%`, securely wrapping to a secondary line underneath the primary label properties and transforming the horizontal gap spacing seamlessly into a `margin-top` vector.

### **Optional Text & Required Mutually Exclusive Parsing**

- By design standards, a component cannot logically be both "Required" and mapped as "Optional".
- To bulletproof implementations natively, the adapter forcibly suppresses rendering of the `resolvedOptionalText` strings if the parent wrapper invokes `required={true}`.
- `optionalText` can operate as dynamic data or specifically as a boolean `true`, which forces the adapter to natively render the formal `(Optional)` string map.

### **The "Edit Icon" Replacer Logic**

- Passing `withEditIcon={true}` evaluates it as fundamentally mutually exclusive to the standard required indicator asterisk.
- `required={required && !withEditIcon}` is passed to the underlying Mantine structure so the native `*` is entirely suppressed.
- Added localized styling via `data-replaces-asterisk={required ? "true" : undefined}` onto the `.editIconWrapper` element. If an editable instance is simultaneously designated as required, the edit icon functionally assumes the indicator role natively, overriding its default icon metrics explicitly to match `--recursica_ui-kit_components_label_properties_colors_asterisk`.

### **Bypassing `Input.Wrapper` Integrations**

- By decoupling from Mantine's standard `Input.Wrapper`, the `Label` component is exclusively mapped manually through `FormControlWrapper`. This grants us exact visual sync regarding where the label renders based on `formLayout="stacked"` or `formLayout="side-by-side"`, without fighting internal Mantine positional hooks that assume vertical stacking by default.

### **Label Size Container Constraints**

- The `labelSize` parameter (mapping values like `"small"`) internally **does not scale typographic font metrics**. Instead, it dynamically defines the explicit horizontal bounding width limit of the block container itself.
- **Architectural Rule:** `labelSize` modifications are strictly designed to execute exclusively when `formLayout="side-by-side"` is active. It acts as an optical grid threshold ensuring left-aligned string wrappers constrain correctly uniformly down a column without bleeding into the physical input arrays alongside them.

## Outstanding Technical Debt / Issues

### **Description Property Omission**

- **Issue:** Currently, the adapter `Label` does not natively parse or support a structured `description` node directly attached beneath it.
- **Context:** Standard forms often attach subtext beneath inputs, but mapping a description purely within the `<Label>` (distinct from an overall form-control description) is omitted structurally until subsequent UI Kit requirements mandate dedicated `description` styles locally on the label component itself.

### **Global Interactive Hover Mappings**

- **Issue:** Currently, the `editIconWrapper` lacks a dedicated hover background layer.
- **Context:** While the global theme abstracts interactive hover environments deeply using layered variable syntax (e.g., `--recursica_brand_layer_1_elements_interactive_hover-color`), Recursica's token generation framework natively fails to expose a universally generic placeholder token (e.g., `--recursica_elements_interactive_hover-color`) which downstream wrappers can map their `<Layer>` injections directly into safely.
- **Resolution Path:** We are explicitly ignoring the `.editIconWrapper:hover` background color assignment until the raw Figma token exports directly scaffold a generic token placeholder that we can interface cleanly with across arbitrary `<Layer>` contexts, avoiding manually mapping statically hardcoded depths (`layer-0`, `layer-1`).
