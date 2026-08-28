# AutoComplete Implementation Notes

## Form Control Wrapping

The `AutoComplete` component is wrapped using the `WithReadOnlyWrapper` to seamlessly bridge standard `InputWrapperProps` attributes (like `label`, `error`, `assistiveText`) directly onto the macro Recursica `<FormControlWrapper>`.

## CSS Layout Execution

The baseline structure maps identical `HARDCODED VALUES` as standard text inputs (`border-width: 1px`, `display: flex`). The `.root` dynamically overrides the `--input-left-section-size` and `--input-right-section-size` to accurately allocate whitespace for prepended or appended icons natively matching the underlying UI token layout system securely.

## Dropdown Styling

The Mantine `<Autocomplete>` dropdown menu and options are styled strictly using native UI-Kit variables mapping border radii, shadows, and base colors (`.dropdown` and `.option`).

## State Cascade Architecture

Focus, errors, and disabled visual states are enforced explicitly via the outer `<FormControlWrapper>` boundary emitting context down structurally (`[data-error]`, `[data-disabled]`) and evaluated efficiently against scoped nested selectors natively inside `AutoComplete.module.css`.

## Missing Selected Option Highlight

`.option:hover`/`.option[data-hovered="true"]` work — hover has a real background tint. There's no
equivalent for "this option matches the current value" though, and it isn't fixable in CSS alone:
Mantine's `Autocomplete` never passes a `value` prop into its internal `OptionsDropdown` (only
`search`, for filtering — see `node_modules/@mantine/core/esm/components/Autocomplete/Autocomplete.mjs`),
so `OptionsDropdown`'s `checked` (and the `data-combobox-active` attribute it drives — the same one
`Dropdown`'s equivalent highlight below keys off) never gets set on any option, no matter what's
typed into the field. See `Dropdown.module.css`'s `.option[data-combobox-active="true"]` rule for
what a real fix would key off, if this ever gets solved upstream or by reimplementing option
rendering with our own value comparison.

## Rich Option Content (`leadingIcon`/`supportingText`)

`data` items accept optional `leadingIcon`/`supportingText` fields, via the shared `RecursicaComboboxItem` type in `@recursica/adapter-common` (see `MANTINE_ADAPTER_RICH_OPTION_DATA.md` at the repo root) — the same type `Dropdown` and both `mui-adapter` components use. `AutoComplete.tsx` installs a default `renderOption` (`../../utils/renderRichOption.tsx`, shared with `Dropdown`) that reads these off Mantine's parsed `option`. `label` on the shared type is optional — Mantine's `getParsedComboboxData` only preserves an item's extra fields when it already has both `value` and `label`; an item with `value` only is rebuilt into a bare `{value, label: value, disabled}` object first, dropping `leadingIcon`/`supportingText`. `AutoComplete.tsx` runs `data` through adapter-common's `normalizeComboboxData` (backfills `label` from `value`) before handing it to Mantine, so the rich fields always survive regardless of whether the caller set `label` (`Dropdown.tsx` does the same now that its `label` is optional too). New CSS classes (`.optionContent`/`.optionIcon`/`.optionText`/`.optionSupportingText`) reuse the menu-item component's icon/supporting-text tokens, matching Dropdown's equivalent addition — no dedicated autocomplete-option tokens exist for either. The icon is a conditional child (only rendered when `leadingIcon` is set, not a hidden reserved slot), so label/supportingText shift left when there's no icon; `.optionContent`'s `align-items: center` keeps the label vertically centered when there's no `supportingText`.

## `wrapItemText`

`label`/`supportingText` default to single-line truncation with an ellipsis (`.optionText > *` — `overflow: clip; overflow-clip-margin: 0.35em; text-overflow: ellipsis; white-space: nowrap`). Passing `wrapItemText` adds `.optionTextWrap` alongside `.optionText`, which re-enables wrapping (`white-space: normal; overflow-wrap: anywhere`) for both children — same later-cascade-wins mechanism (`.optionTextWrap > *` declared after `.optionText > *`, equal specificity) as the rest of this file's overrides. `renderRichOption`/`renderRichOptionContent` (shared util, both adapters) take `wrapItemText` as a third parameter and combine the two class names when it's true.

`.optionText > *` used plain `overflow: hidden` until 2026-08-28 (Matt Massey) — it clipped
descenders (e.g. "g") whenever `text_line-height` is tighter than the font's natural
ascent+descent. `overflow-clip-margin` gives ink a small bleed allowance while still clipping
genuinely overflowing text; same project-wide fix as Chip's `CHIP_IMPLEMENTATION_NOTES.md`.
