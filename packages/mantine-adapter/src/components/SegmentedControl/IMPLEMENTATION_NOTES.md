# SegmentedControl Implementation Notes

## 1. Stripping Mantine's Native Variants and Sizes

The Figma design tokens for the SegmentedControl component do not define nested layers of variants (such as `solid`, `outline`) or specific sizing steps (`xs`, `sm`, etc.). They are defined globally. Therefore, we explicitly `Omit` the standard `variant`, `size`, `radius`, and `color` props from the generic Mantine `SegmentedControlProps` interface.

## 2. Hardcoded Overrides for Figma Strictness

Mantine injects inline hover styles on `.label` (specifically, adding a subtle gray background when hovering). Since Recursica defines explicit transparent or specifically-driven hover states, we use `!important` tags within `SegmentedControl.module.css` for background and typography overriding.

## 3. Divider Separators

Mantine uses an `::before` pseudo-element on the `.control` block to draw standard visual separators between adjacent elements. Instead of stripping this functionality out, we hook directly into the pseudo-element and override its `background-color` with `--recursica_ui-kit_components_segmented-control_properties_colors_divider-color`.

## 4. Indicator Mapping

The moving active background element (`.indicator`) is decoupled from the actual text label. It is styled natively with its own background color, border size, and elevation shadow variables to match the exact visual parity of a "floating active chip" as defined in the Recursica properties map.
