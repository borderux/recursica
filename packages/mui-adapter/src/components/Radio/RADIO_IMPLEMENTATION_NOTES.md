# Radio Implementation Notes

### `Radio.Group` `controlMaxWidth` bug (fixed 2026-08-31)

`RadioGroup` was passing `--recursica_ui-kit_components_radio-button-item_properties_max-width`
(400px) as its own `controlMaxWidth`. That token caps a single radio+its own label — it's
already applied per-item via `.root` in `Radio.module.css`. Passed as the _group's_
`controlMaxWidth`, `FormControlLayout` applies it to the whole root row, so in side-by-side
layout the group's own label got squeezed into that same 400px alongside the radios. There is
no group-level max-width token in the schema — fixed by leaving `controlMaxWidth` `undefined`,
matching `SwitchGroup`'s existing pattern. Same bug existed in `CheckboxGroup`, fixed the same
way. Mirrors the identical fix in mantine-adapter (source of truth).
