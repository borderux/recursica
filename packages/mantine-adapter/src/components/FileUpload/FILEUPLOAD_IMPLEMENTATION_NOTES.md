# FileUpload Implementation Notes

## Architecture Overview

`FileUpload` is a fully custom composite — unlike most other adapter components, there is no
single underlying Mantine primitive to wrap (Mantine core ships `FileInput`, a styled single-line
file input, but no drag-and-drop dropzone UI; that's a separate `@mantine/dropzone` package we
deliberately did not add — see "Why not `@mantine/dropzone`" below). The component composes:

1. **The dropzone** — a plain `<div>` handling native HTML5 drag-and-drop events
   (`onDragOver`/`onDrop`), containing an upload icon, instructional text, and a hidden
   `<input type="file">` triggered by...
2. **The browse button** — this adapter's own `<Button variant="outline" size="small">`.
3. **The file list** — this adapter's own `<Chip>` component (with `onRemove`), one per entry in
   the controlled `files` prop.

This shape is **not configurable** — there is no prop to render a bare native file input without
the dropzone chrome (that's what the separate, still-stub `FileInput` component is for).

## Why not `@mantine/dropzone`

Mantine's own drag-and-drop package (`@mantine/dropzone`) would require adding a new peer
dependency purely for its interaction logic (drag events, accept/reject callbacks) — its visual
output is fully overridden by our own CSS module regardless, and the interaction logic itself is
a handful of native `DragEvent`/`<input type="file">` handlers. Implementing it directly with
native DOM APIs keeps this component's behavior identical across the Mantine and MUI adapters
(neither ships a drag-and-drop dropzone natively), matching the "one API, any kit" goal in the
canonical `COMPONENT_DEV_GUIDE.md` more literally than either library's own package would. (Matt
Massey, 2026-08-11.)

## Why `Chip` for the file list, not a bespoke tag element

`recursica_variables_scoped.css`'s `file-upload` token namespace defines `item-gap`/`list-spacing`
(spacing between/around file entries) but **no color/border tokens of its own for the file
entries themselves** — the visual design intentionally delegates that to the existing `Chip`
component's own token namespace (`--recursica_ui-kit_components_chip_...`). Reusing `<Chip
onRemove={...}>` directly (rather than reimplementing a similar-looking element) keeps that
separation intact per the canonical guide's "Component Specificity" rule — `FileUpload.module.css`
never reaches into `chip`'s namespace, and `Chip.module.css` never reaches into `file-upload`'s.

`checked={false}` is passed explicitly (with no `onChange`) to keep each chip a static, always-
unchecked removable tag — `Chip` is fundamentally a Mantine `Chip` (checkbox/radio-style toggle)
under the hood, and a file name isn't something a user should be able to "check"; controlling
`checked` prevents clicking the label text from toggling Chip's own selected-state styling.

## `border-style` and the malformed Figma token

`--recursica_ui-kit_components_file-upload_properties_border-style` exists in
`recursica_variables_scoped.css`, but its value is the **literal string** `"dashed"` (quotes
included) — not a valid CSS `<line-style>` keyword. Using it via `var(...)` would silently resolve
to an invalid declaration (the browser drops it, and the border falls back to `initial`/`none`,
with no error surfaced anywhere). This is consistent with how `border-style` is already treated
everywhere else in this adapter (e.g. `TimePicker`/`DatePicker` both hardcode `border-style:
solid`) — the canonical guide explicitly lists `border-style` as a baseline/hardcoded structural
value, not a tokenized one. Hardcoded to the keyword `dashed` directly; the malformed token is
`recursica-ignore`d with a note in `FileUpload.module.css`. Worth flagging to design/Forge if the
token is meant to be consumable as-is in a future export.

## No dedicated icon-size token

Unlike `TextField`/`DatePicker`, `file-upload` has no `properties_icon-size` token. The upload
icon is sized with a hardcoded `2rem` to visually match the Figma reference image
(`packages/adapter-common/src/components/FileUpload/fileupload.png`); revisit if a dedicated token
is ever added.

## No distinct "dragging over" visual state

There's no `recursica_variables_scoped.css` token for a drag-hover appearance (only `default`,
`disabled`, and `error` are defined for `file-upload`). Rather than inventing a color/border value
for it, the dropzone has no visual change while a file is being dragged over it — only the
native browser drag cursor. Revisit if a token is added.

## No read-only mode

Every other form-control-shaped component in this adapter (`TextField`, `DatePicker`,
`TimePicker`, ...) supports `readOnly` via `WithReadOnlyWrapper`, rendering the value as static
text. `FileUpload` uses `FormControlWrapper` directly instead, with no `readOnly` prop — the
Figma reference (`fileupload.png`) only depicts the interactive dropzone and an empty state, no
distinct read-only rendering, and "read-only" is a less obvious concept for a file list than for a
single text/date/time value. Revisit if a read-only rendering is specified.

## Not a nested interactive element

The dropzone `<div>` itself has no `onClick`/`role="button"`/`tabIndex` — only the explicit
"Browse files" `<Button>` opens the native file picker. Many dropzone implementations make the
entire box clickable in addition to drag-and-drop, but the Figma reference shows the button as
the sole explicit affordance, and avoiding a second, redundant click target inside (or wrapping)
a real `<button>` avoids any nested-interactive-element accessibility ambiguity.
