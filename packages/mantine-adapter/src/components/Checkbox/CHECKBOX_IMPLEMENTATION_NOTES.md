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

### `Checkbox.Group` `controlMaxWidth` bug (fixed 2026-08-31)

`CheckboxGroup` was passing `--recursica_ui-kit_components_checkbox-item_properties_max-width`
(400px) as its own `controlMaxWidth`. That token caps a single checkbox+its own label — it's
already applied per-item via `.root` in `Checkbox.module.css`. Passed as the _group's_
`controlMaxWidth`, `FormControlLayout` applies it to the whole root row (`max-width` on
`.root`, which contains both `leftSection`/label and `rightSection`/items), so in side-by-side
layout the group's own label got squeezed into that same 400px alongside the checkboxes. There
is no group-level max-width token in the schema (`checkbox-group_variants_layouts_*` only
covers gutter/margin/padding) — fixed by leaving `controlMaxWidth` `undefined`, matching
`SwitchGroup`'s existing pattern. Same bug existed in `RadioGroup` (`radio-button-item_
properties_max-width`), fixed the same way.
