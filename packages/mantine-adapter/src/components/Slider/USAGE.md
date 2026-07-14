# Slider - Usage Guide

This document describes how to integrate and use the `Slider` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { Slider } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { Slider } from "@recursica/mantine-adapter";

export default function Demo() {
  return <Slider defaultValue={50} min={0} max={100} label="Volume" />;
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

## 1. Bidirectional State Synchronization

**Decision:** Maintain a highly responsive, bidirectional connection between the sliding track value and the adjacent numeric text input.
**Implementation:**

- The slider track requires a clean `number` state, whereas the text box requires a `string` state (`inputValue`) to allow typing intermediate characters like decimals (`2.`), negative signs (`-`), or empty text without breaking standard React input binding.
- A `useEffect` hook continuously feeds the outer numeric state changes back into the text input value as a string representation.
- Input changes instantly parsed as float clamp bounds securely. On blur (`onBlur`), the input state is automatically sanitized and reset to the clean, clamped string representation of the final track value.

## 2. Outer Form Control Wrapper Integration

**Decision:** Bypass Mantine's native `Input.Wrapper` and `label` properties.
**Implementation:**

- Universal form wrappers like `<FormControlWrapper>` and `<WithReadOnlyWrapper>` handle the outer layout architecture, including labels, assistive text, error states, and optional edit-triggering fields.
- Therefore, we map the outer form label directly to the `label` property of the `Slider` (delegated to the wrapper), and rename Mantine's internal dragging tooltip label property to `tooltipLabel`.

## 3. Custom Min-Max Labels and Step Indicators

**Decision:** Enforce rigid typography tokens on lower bounds and custom mark indicators.
**Implementation:**

- Mantine's native mark and step structures are fully styles-mapped back to our scoped variables in `Slider.module.css`.
- Min and Max numeric guides are rendered directly to the left and right of the slider track, centered vertically and spaced automatically using standard input gaps, while dynamically fetching custom typography tokens for min-max labels to avoid hardcoded formatting constraints.

## 4. Visual Overrides for Stacked and Side-by-Side Spacing

**Decision:** Enforce layout margins dynamically based on container orientation parameters.
**Implementation:**

- Using custom layouts (e.g. `stacked` and `side-by-side`), we override the margins by assigning the component-specific Figma spacing variables to the unified `--form-control-margin-bottom` property.

## 5. Right-Aligned Floating Current Value

**Decision:** Position the current active value of the slider directly above the max guide (or right-side element) on the right side of the track.
**Implementation:**

- Wrap the max guide element in a relative layout container (`.rightGuideContainer`) to provide a positioning anchor.
- Place the active value element (`.currentValue`) inside `.rightGuideContainer` and position it absolutely (`bottom: calc(100% + var(--recursica_ui-kit_globals_form_properties_label-field-gap-vertical, 8px))`, `right: 0`).
- This absolute positioning strategy guarantees that the active value floats cleanly above the track's right side, while aligning it vertically on the Y-axis to sit in perfect baseline alignment with the component's left-aligned form label.
- Set typography using the Figma-aligned component-specific read-only value variables (`--recursica_ui-kit_components_slider_properties_read-only-value_...`).
- Allow the text color of both the floating current value (`.currentValue`) and the component's read-only value (`.readOnlyValue`) to naturally inherit from their parent states/form globals, automatically supporting default (`--form-field-text-valued`), disabled (`--form-field-disabled-text`), and error colors without explicit color overrides, matching the min/max guides.
- If `showInput` is enabled, the floating `.currentValue` is hidden since the active value is already displayed and editable within the adjacent numeric text input, avoiding visual redundancy.
- In `side-by-side` form layouts, the `.currentValue` is positioned inline (static positioning) to the right of the max label rather than floating above it, centered vertically with the max label and aligned right to the container. This uses CSS flexbox ordering (`order: 2` for `.currentValue` and `order: 1` for `.minMaxGuide`) to visually swap their positions while preserving clean, semantic DOM ordering.
- To ensure perfect, pixel-perfect vertical track alignment between sliders that show numeric text inputs (`showInput={true}`) and sliders that display the active inline value (`showInput={false}`), the `.currentValue` element is globally given a width equal to the input width (`var(--recursica_ui-kit_components_slider_properties_input-width)`) and right-aligned (`text-align: right`). In `side-by-side` layouts, `.rightGuideContainer`'s flex gap is also matched to the horizontal input-to-track gap (`var(--recursica_ui-kit_components_slider_properties_input-gap)`), making the horizontal space occupied by the rightmost elements exactly identical in both component modes.
