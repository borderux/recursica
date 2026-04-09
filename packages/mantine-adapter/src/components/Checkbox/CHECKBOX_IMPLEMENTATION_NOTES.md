# Checkbox Implementation Notes

## Architectural Philosophy

The `Checkbox` primitive requires aggressive structural modifications to decouple Mantine's built-in arrays (`<Checkbox.Group>`) tying the raw DOM nodes seamlessly back into Recursica's unified form definitions flawlessly.

### Checkbox Alignment Anchoring (gap overflow hack)

By default, placing a Checkbox alongside a deeply wrapping multi-line label causes native geometric drifts natively. Because Mantine aligns the Checkbox graphic to the top of standard `display: flex` boxes, its optical center will appear natively skewed slightly _too high_ against the very first typographic text-line.

We mathematically fix this alignment within `Checkbox.module.css` using explicit design variable arithmetic natively.
\`\`\`css
margin-top: calc(
(
var(--recursica_ui-kit_components_checkbox-item_properties_text_line-height) \*
var(--recursica_ui-kit_components_checkbox-item_properties_text_font-size) -
var(--recursica_ui-kit_components_checkbox_properties_size)
) / 2
) !important;
\`\`\`
This calculation ensures that the optical center of the `.inner` checkmark vector perfectly snaps onto the relative center of the text's line-height, permanently solving pixel-drifts natively!

### Checkbox.Group Overrides

To decouple `<CheckboxGroup>` away from `<Input.Wrapper>`, we explicitly extract the raw array execution mapped correctly against our identical `RecursicaFormControlWrapperProps` schema structurally!
