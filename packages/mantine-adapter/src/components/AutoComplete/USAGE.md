# AutoComplete - Usage Guide

This document describes how to integrate and use the `AutoComplete` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { AutoComplete } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

```tsx
import React from "react";
import { AutoComplete } from "@recursica/mantine-adapter";

export default function Demo() {
  return (
    <AutoComplete
      label="Country"
      placeholder="Type a country name..."
      data={["USA", "Canada", "Mexico"]}
    />
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

## Form Control Wrapping

The `AutoComplete` component is wrapped using the `WithReadOnlyWrapper` to seamlessly bridge standard `InputWrapperProps` attributes (like `label`, `error`, `assistiveText`) directly onto the macro Recursica `<FormControlWrapper>`.

## CSS Layout Execution

The baseline structure maps identical `HARDCODED VALUES` as standard text inputs (`border-width: 1px`, `display: flex`). The `.root` dynamically overrides the `--input-left-section-size` and `--input-right-section-size` to accurately allocate whitespace for prepended or appended icons natively matching the underlying UI token layout system securely.

## Dropdown Styling

The Mantine `<Autocomplete>` dropdown menu and options are styled strictly using native UI-Kit variables mapping border radii, shadows, and base colors (`.dropdown` and `.option`).

## State Cascade Architecture

Focus, errors, and disabled visual states are enforced explicitly via the outer `<FormControlWrapper>` boundary emitting context down structurally (`[data-error]`, `[data-disabled]`) and evaluated efficiently against scoped nested selectors natively inside `AutoComplete.module.css`.

## Missing Active Option Color

Currently, there is no explicit JSON token for the background color of an active/hovered option in the AutoComplete dropdown. We temporarily map `.option:hover` and `.option[data-combobox-active]` to the `--recursica_ui-kit_components_autocomplete_variants_states_focus_properties_colors_background` variable. Because this variable maps to the base field background, the highlight is currently invisible. This will be updated once the correct token is added to the UI kit.
