# DatePicker Implementation Notes

## Architecture Overview

The `DatePicker` component is a wrapper around the `@mantine/dates` `DatePickerInput` component, implementing the `FormControlWrapper` macro structure for Recursica. This ensures that the component visually and structurally aligns with standard Recursica input primitives.

## Structural Constraints

1. **Naked Input Usage**: We intentionally pass `label={undefined}`, `description={undefined}`, and `error={undefined}` to the Mantine `DatePickerInput` component. This suppresses Mantine's internal macro form wrapping and ensures that only our `WithReadOnlyWrapper` > `FormControlWrapper` orchestrates labels, description text, and ARIA state error boundaries.
2. **Read-Only Implementation**: Since the value type for `DatePickerInput` can be a date object, string, or array, the `WithReadOnlyWrapper` attempts to safely cast the output value using standard `String(value)`. For production apps utilizing heavy date formatting logic, developers can pass a custom `readOnlyComponent` explicitly to bypass this default cast.
3. **Calendar Portal/Dropdown (Figma Token Issue)**: The Recursica UI Kit's `date-picker` component in Figma fails to export any explicit structural or color properties for the calendar popover itself (e.g. elevation, surface background, selected day colors). To solve this organically within the framework without breaking strict token adherence, we manually override the Mantine `.dropdown` and `.day[data-selected]` classes using `--recursica_ui-kit_components_hover-card-popover` tokens for elevation/padding/surfaces, and `--recursica_ui-kit_components_button_variants_styles_solid` tokens for the selected primary blue day. This guarantees strict visual adherence to the system until explicitly mapped tokens are provided in the UI Kit.

## Styling Quirks

- The `DatePickerInput` mimics Mantine's `Input` structure natively (`.input`, `.wrapper`, `.section`). We attach our `styles.input` and `styles.root` classes exactly like `TextField`.
- The global layout margin override (`.layoutOverride`) utilizes `--form-control-margin-bottom` driven by specific stacked/side-by-side design tokens.
