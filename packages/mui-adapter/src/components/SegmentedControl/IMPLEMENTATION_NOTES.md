# SegmentedControl Implementation Notes

## Labels rendering uppercase (2026-08-19)

- **Root cause:** `--recursica_ui-kit_components_segmented-control-item_variants_selection-states_{unselected,selected}_properties_text_text-transform` resolves to `--recursica_tokens_font_cases_original`, which has no definition in `recursica_variables_scoped.css` (only `_lowercase`/`_titlecase`/`_uppercase` are defined there). The resulting `var()` on `.label` is invalid, and since `text-transform` is an inherited property, the invalid value falls back to the inherited value from `.control` (`.MuiToggleButton-root`) — which carries MUI's own `text-transform: uppercase` button default. Mantine's control has no such native uppercase default, so the same broken token never surfaced there.
- **Fix:** Reset `text-transform: none` on `.root .control` alongside the other MUI ToggleButton baseline resets (padding/border/etc.) already there, so nothing uppercase is left to inherit. Matches the existing `text-transform: none` MUI-baseline reset pattern in `Button.module.css`. Not a design-token value — it's a structural reset of MUI's own default, same category as the other hardcoded resets already exempted at the top of this file.

## Per-item `icon`

`RecursicaSegmentedControlProps.data` objects accept an optional `icon`, rendered ahead of `label` inside the existing `.label` div (already a flex container with the icon-size/gap tokens wired), so no CSS changes were needed.

## Whole-control `disabled`

`RecursicaSegmentedControlProps.disabled` was previously typed `never` and stripped at runtime. It's now a real `boolean?`, passed straight through to MUI's native `ToggleButtonGroup.disabled`, which cascades to every child `ToggleButton` via `ToggleButtonGroupContext`. Per-item `data[].disabled` now passes `undefined` (not `false`) when unset, so it doesn't mask that context cascade — an item's own explicit `disabled` still overrides the group.
