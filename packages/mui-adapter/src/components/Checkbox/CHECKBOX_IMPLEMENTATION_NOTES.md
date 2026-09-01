# Checkbox Implementation Notes

### `Checkbox.Group` `controlMaxWidth` bug (fixed 2026-08-31)

`CheckboxGroup` was passing `--recursica_ui-kit_components_checkbox-item_properties_max-width`
(400px) as its own `controlMaxWidth`. That token caps a single checkbox+its own label — it's
already applied per-item via `.root` in `Checkbox.module.css`. Passed as the _group's_
`controlMaxWidth`, `FormControlLayout` applies it to the whole root row (`max-width` on
`.root`, which contains both `leftSection`/label and `rightSection`/items), so in side-by-side
layout the group's own label got squeezed into that same 400px alongside the checkboxes. There
is no group-level max-width token in the schema (`checkbox-group_variants_layouts_*` only
covers gutter/margin/padding) — fixed by leaving `controlMaxWidth` `undefined`, matching
`SwitchGroup`'s existing pattern. Same bug existed in `RadioGroup`, fixed the same way.
Mirrors the identical fix in mantine-adapter (source of truth).
