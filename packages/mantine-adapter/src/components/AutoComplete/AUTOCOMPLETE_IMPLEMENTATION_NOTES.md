# AutoComplete Implementation Notes

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
