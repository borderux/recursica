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
3. **The file list** — this adapter's own `<Chip>` component (with `onDelete`), one per entry in
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
onDelete={...}>` directly (rather than reimplementing a similar-looking element) keeps that
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

## Dragging-over visual state (Matt Massey, 2026-08-17)

Previously flagged as a known gap ("no distinct dragging-over visual state" — there's still no
`file-upload`-specific token for it), now implemented using two existing generic tokens instead of
inventing new component-scoped ones:

- **Background**: the same "Global Hover Hack Overlay" recipe `Button.module.css` already uses —
  a `::after` pseudo-element sized to `inset: 0`, `background-color:
var(--recursica_brand_states_hover_color)`, faded in to `var(--recursica_brand_states_hover_opacity)`
  via `[data-dragging="true"]` instead of `:hover`. Requires `.dropzone` to be `position: relative`
  and its real children `position: relative; z-index: 1` so they render above the overlay.
- **Border**: `--form-field-border-selected`, the bridge custom property `FormControlWrapper`
  already sets from `--recursica_ui-kit_globals_form_field_colors_border-selected` on its own
  `.root` (an ancestor of `.dropzone` here) — defined for exactly this kind of cross-component
  reuse, but unused anywhere until now. Chosen over reaching for the global token directly, since
  the existing bridge-var pattern is how other component CSS in this adapter already consumes
  globals it doesn't own (see `FormControlWrapper.module.css`).

Tracked via a `dragCounterRef` in `FileUpload.tsx`, not a plain boolean: `dragenter`/`dragleave`
fire for every child element the pointer crosses, not just the dropzone itself, so a plain
enter-sets-true/leave-sets-false toggle flickers off every time the pointer passes over the icon,
label, or button inside the dropzone. Counting nested enter/leave pairs and only clearing the
state at net-zero avoids that.

## Read-only mode (Matt Massey, 2026-08-18)

Previously flagged as a known gap ("no read-only mode" — see below). Unlike `TextField`/
`DatePicker`, there's no single "value" to swap for static text via `WithReadOnlyWrapper` — a file
list's read-only form is the same chip list, just without the ability to remove anything. So
`readOnly` is handled directly in `FileUpload.tsx` rather than reusing `WithReadOnlyWrapper`:

- The dropzone (icon, instructional text, Browse button, hidden `<input>`) is omitted entirely.
- Each `Chip` is rendered with no `onDelete` (and no `deleteTabIndex`/`deleteIconRef`/roving
  keyboard handlers, which only exist to manage the remove icon) — `Chip` itself already renders no
  remove icon at all when `onDelete` is `undefined`, so this falls out for free rather than needing
  a separate `readOnly` prop on `Chip`.
- `disabled` is independent of `readOnly` and has no effect when `readOnly` is set (there's no
  dropzone/remove icon left for it to disable).

Original gap this replaces: Figma's `fileupload.png` reference only depicted the interactive
dropzone and an empty state, no distinct read-only rendering — revisited once one was specified.

## Assistive text/error delegated back to FormControlWrapper (Matt Massey, 2026-08-18)

Briefly changed to have `FileUpload` render its own `AssistiveElement` directly (dropzone →
assistive/error → file list, all inside the one `children` slot `FormControlWrapper` sees) so the
file list could sit _below_ the assistive text instead of `FormControlWrapper`'s default of
rendering assistive/error _after_ whatever `children` it's given. Reverted at Matt's request:
`assistiveText`/`error` are passed straight through to `FormControlWrapper` again (file list
renders above the assistive/error text, same as every other form control), and `FileUpload` no
longer manages its own `aria-describedby`/`aria-errormessage` wiring — `FormControlWrapper`'s own
`cloneElement` handles that automatically since `FileUpload`'s root `<div>` is a single element.

## Built-in error for `accept` mismatches (Matt Massey, 2026-08-18)

A file rejected for not matching `accept` (see below) now surfaces as the control's own error
state by default, rather than leaving the integrator to wire up `onFilesRejected` into their own
`error` prop just to get a message on screen. `handleFiles` tracks whether the _most recent_
drop/pick attempt included an `accept` mismatch (`invalidTypeRejected` state) and `FileUpload`
computes `effectiveError = error ?? (invalidTypeRejected ? invalidFileTypeMessage : undefined)` —
an explicit `error` prop always wins over the built-in one. The message itself is a new
`invalidFileTypeMessage` prop (`RecursicaFileUploadProps`, adapter-common), defaulting to
`"File type not accepted"`. Scoped to `accept` mismatches only — a `maxSize` rejection still has no
built-in message, since `onFilesRejected` is the only signal for that case and there's no single
reasonable default (unlike the type-mismatch text, "too large" needs the actual limit in it).

## `accept` is now enforced on drop, not just the picker dialog (Matt Massey, 2026-08-18)

The native `accept` attribute on the hidden `<input type="file">` only constrains the browser's own
file-picker dialog — it has **no effect on a `drop` event**, so a file dragged directly onto the
dropzone previously bypassed `accept` entirely regardless of extension/MIME type (the prior doc
comment on `RecursicaFileUploadProps.accept` claimed otherwise; that was wrong and has been
corrected). `handleFiles` (shared by both the picker and drop paths) now also validates every file
against `accept` via a new shared `fileMatchesAccept(file, accept)` util in `adapter-common`
(mirrors the native attribute's own comma-separated extension/MIME/MIME-wildcard semantics) and
routes non-matching files to `onFilesRejected`, the same callback already used for `maxSize`
rejections.

## Not a nested interactive element

The dropzone `<div>` itself has no `onClick`/`role="button"`/`tabIndex` — only the explicit
"Browse files" `<Button>` opens the native file picker. Many dropzone implementations make the
entire box clickable in addition to drag-and-drop, but the Figma reference shows the button as
the sole explicit affordance, and avoiding a second, redundant click target inside (or wrapping)
a real `<button>` avoids any nested-interactive-element accessibility ambiguity. (This is
independent of the file list's own keyboard navigation below, which lives entirely in the
separate `Chip` list, not the dropzone.)

## Custom upload icon (Matt Massey, 2026-08-17)

Added `icon?: React.ReactNode` to `RecursicaFileUploadProps` (adapter-common) — `FileUpload`
renders `icon ?? <UploadIcon />` inside the same `.uploadIcon` span either way, so a custom icon
picks up the same `color`/`width`/`height` styling the default one gets (use `currentColor` and
fill the viewbox, like `UploadIcon` does, for it to inherit correctly).

## Browse button size (Matt Massey, 2026-08-17)

The "Browse files" `<Button>` was hardcoded to `size="small"`. There's no design rationale for a
smaller-than-normal button here — the Figma reference simply wasn't checked against `Button`'s own
size tokens closely enough when this was first built. Removed the `size` prop entirely so it falls
through to `Button`'s own default (`"default"`, the standard size used everywhere else in both
adapters).

## Keyboard navigation for the file chip list (Matt Massey, 2026-08-17)

The file list previously had no group-level keyboard model at all — each chip's remove icon was
simply the next `tabIndex={0}` element in natural DOM order (and, in the Mantine adapter, so was
each chip's own hidden checkbox `<input>`, since `Chip`'s `isInteractive` check treats any chip
with `onDelete` as tabbable-by-default — a second, redundant tab stop specific to this adapter).
Implemented a standard roving-tabindex pattern instead, matching `Tree`'s existing keyboard model
(see `../Tree/IMPLEMENTATION_NOTES.md`) rather than inventing a new one:

- **Tab reaches exactly one stop per chip list, landing on the first chip.** `FileUpload` tracks
  `activeChipIndex` (initially `0`) and passes `deleteTabIndex={index === activeChipIndex ? 0 : -1}`
  to each `Chip` — a new pass-through prop added to `RecursicaChipProps`/both adapters' `Chip.tsx`
  (see `../Chip/CHIP_IMPLEMENTATION_NOTES.md`) that overrides the remove icon's own tabIndex. Every
  chip in the Mantine adapter is also given a plain `tabIndex={-1}` directly (flows through to
  `MantineChip`'s underlying checkbox `<input>` via the existing `sanitizedProps` passthrough) to
  kill that second, unwanted tab stop — the chip's label/checkbox was never meant to be
  interactive here (`checked={false}`, no `onChange`), only its remove icon is.
- **Enter removes the focused chip, with focus already on its remove icon.** No new code needed —
  `Chip`'s remove icon already calls `onDelete` on `Enter`/`Space`, and it's already the focused
  element by construction (see above), so "focus ring on the remove icon" falls out for free from
  the existing `.deleteIcon:focus-visible` style.
- **Left/Right or Up/Down move focus between chips.** A `onKeyDown` handler on the file list `<div>`
  (event delegation — it fires for keydowns on any focused chip inside it) computes the next index
  (wrapping at both ends) and moves real DOM focus there via `deleteIconRefs`, an array of refs
  populated through the new `deleteIconRef` prop on `Chip` (same PR as `deleteTabIndex`).
- **Focus survives removal.** Since `files` is a controlled prop `FileUpload` doesn't mutate
  itself, removing a chip doesn't shrink `files` until the consumer's own state update flows back
  down as a new prop — a `useEffect` keyed on `files` detects the length decreasing, clamps
  `activeChipIndex` to the new last-valid index, and re-focuses that chip's remove icon, so focus
  never falls out of the list back to `<body>`.

## Maximum file count (Matt Massey, 2026-08-18)

Added `maxFiles`/`maxFilesMessage` to `RecursicaFileUploadProps` (adapter-common), enforced the
same way `maxSize`/`accept` already are: `handleFiles` compares `files.length` (the current count)
plus how many of the incoming batch have already been provisionally accepted against `maxFiles`,
and routes anything past the cap to `onFilesRejected` instead of `onFilesAdded`. The built-in
`maxFilesMessage` ("Maximum of {maxFiles} files allowed") surfaces through the same
`effectiveError` mechanism `invalidFileTypeMessage` already uses — an explicit `error` prop still
wins over both, and an `accept` mismatch takes priority over a `maxFiles` one when a single drop
triggers both.

## Read-only chips were still interactive (Matt Massey, 2026-08-18)

The `readOnly` file list (added 2026-08-18, see USAGE.md §7) rendered each filename as a
`<Chip checked={false} tabIndex={-1}>` with no `onDelete`, expecting that to be fully inert. Two
separate, previously-latent bugs made it look and behave otherwise — both fixed in
`Chip`/`Chip.module.css`, not `FileUpload` itself, so every consumer of a non-interactive `Chip`
benefits, not just this one:

- **Passing `checked` (even `false`) was misread as "interactive."** `Chip`'s `isInteractive` check
  treated `checked !== undefined` as a signal that the chip was a real toggle, which forced it into
  the tabbable/exposed branch — but a `checked`-controlled chip with no `onChange` can't actually be
  toggled by a click (Mantine's `useUncontrolled` just ignores the click when `value` is externally
  controlled), so that heuristic was measuring the wrong thing. `isInteractive` now only looks at
  whether something actually responds to interaction: `onDelete`, `onClick`, or `onChange`.
- **A read-only chip's cursor still showed `pointer` on hover.** Mantine's own base styles hardcode
  `cursor: pointer` on the chip label class; our CSS never overrode it, so it always leaked through
  regardless of the chip's actual behavior. `.label.label` now resets it to `cursor: default` and a
  new `data-interactive` attribute (set by `Chip.tsx` from the same `isInteractive` check above)
  re-enables `pointer` only when the chip is genuinely clickable.
- **The truncating filename text was itself a phantom, un-styled Tab stop.** `.children` truncates
  long filenames via `overflow-x: hidden` + `text-overflow: ellipsis`. Chromium treats any element
  with non-`visible` overflow whose content actually overflows as a scroll container, and makes
  scroll containers focusable-by-default (so a user can arrow-key-scroll them) — even with no
  `tabindex` attribute at all. Any chip with a long enough label, read-only or not, silently picked
  up an extra Tab stop nobody wrote and no CSS styled a focus ring for. Switched to `overflow-x:
clip`, which clips identically for our purposes (still x-axis only, descenders on the y-axis
  still unaffected — see the 2026-08-18 fix above this one) but doesn't establish a scrollport, so
  it's never a focus candidate.

Confirmed via Playwright against a running Storybook (not just DOM inspection): before the fix,
`Tab` from the "Browse files" button in `WithFiles` landed on the first chip's filename text, THEN
its remove icon — an extra, invisible tab stop before the intended one. After the fix, `Tab` goes
directly to the remove icon, and in `ReadOnly`, `Tab` skips the file list entirely (there's nothing
in it to focus).
