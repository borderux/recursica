# FileInput Implementation Notes

## Architecture overview

`FileInput` replaces the previous "coming soon" stub with a fully custom composite, the same way
`FileUpload` was built (see `../FileUpload/FILEUPLOAD_IMPLEMENTATION_NOTES.md`). It shares
`FileUpload`'s selection/validation contract (`accept`/`maxSize`/`maxFiles`, `onFilesRejected`,
`readOnly`) via a common `RecursicaFileUploadItem` type and near-identical `handleFiles`/drag
logic, but is presented as a single-line, `TextField`-shaped control rather than a dropzone —
Forge's own `file-input` token set is shaped almost identically to `text-field`'s (border-radius,
horizontal/vertical padding, icon-size, icon-text-gap, min-height, placeholder-opacity, a full
`text_*` type-style block), confirming the design intent directly rather than needing to guess it
from the reference screenshot alone.

The control is one clickable, focusable `<div role="button">` containing:

1. **A leading icon** — the upload icon by default, overridable via `icon`.
2. **A content area** — placeholder text when empty, or a horizontally scrollable row of `Chip`s
   (reusing `FileUpload`'s chip, same as its file list) once one or more files are selected —
   single- and multiple-file mode render identically here; only the selection/replace behavior
   differs (see "`multiple` defaults to `false`" below).
3. **A trailing "clear" `Button`** — shown whenever a file is selected; clears the entire current
   selection (see "Trailing clear button" below).
4. **A hidden `<input type="file">`**, triggered programmatically — same approach as
   `FileUpload`'s dropzone, not the "invisible overlay input" pattern some styled file inputs use
   (that pattern would need every interactive child — chip remove icons, the clear icon — to sit
   at a higher stacking context than the overlay just to receive its own clicks; keeping the input
   hidden and driving it via `ref.click()` avoids that entirely).

## The stub's exemption comments described a schema that no longer exists

Before writing any CSS, the stub `FileInput.module.css`'s 43 `recursica-ignore` comments were
checked against `packages/official-release/recursica_variables_scoped.css` directly, rather than
trusted as the token inventory. They didn't match — the stub encoded a `states.default`/
`states.focus`-shaped schema (mirroring the same stale-plugin-export drift documented in
`docs/alignment/ALIGNMENT_2026-08-11.md` §3.2 for other components) that the current export has
never had for `file-input`. The real schema (40 variables, matching that report's own L5 count)
has:

- **Flat, non-state-scoped base properties and colors** (`properties_border-size`,
  `properties_colors_{background-color,border-color,leading-icon,text-color,trailing-icon}`) —
  much closer to `TextField`'s shape than `FileUpload`'s.
- **Only two states — `disabled` and `error`.** No `default` state (the flat properties above
  are the default) and no `focus` state at all.
- **`layouts.{stacked,side-by-side}` each carrying their own `max-width`/`min-width`/
  `top-bottom-margin`** — three properties per layout, not the single flat `max-width`/
  `min-width` an early draft of this component assumed.

Every token actually referenced in `FileInput.module.css` was re-verified against this real list
(38 applied + 2 exempted = 40, zero gap on either adapter).

## No forge-defined focus state — generic ring, same fallback as TextField

Since `file-input` has no `states.focus` axis, `:focus-visible` on the root falls back to the
generic `--recursica_brand_states_focus_*` box-shadow ring, exactly like `TextField`/`DatePicker`
already do for the same reason.

## Disabled/error border-size intentionally unused

Unlike `FileUpload` (which has no border-size token at all to choose from), `file-input`'s export
does define real per-state `border-size` variables for `disabled` and `error`. They're
`recursica-ignore`d anyway and the flat `properties_border-size` is applied uniformly instead —
same house policy `TextField`/`DatePicker` already follow (a border that changes thickness across
states shifts the layout), just applied here to real rather than phantom tokens.

## Why the root is a focusable, clickable `<div>` (a deliberate divergence from FileUpload)

`FileUpload`'s dropzone deliberately has no `onClick`/`role="button"`/`tabIndex` of its own — the
separate "Browse files" `<Button>` is its sole click/keyboard affordance, avoiding a
nested-interactive-element ambiguity (see `FILEUPLOAD_IMPLEMENTATION_NOTES.md`, "Not a nested
interactive element"). `FileInput` has no separate Browse button in the reference design — the
box itself plays that role, the same way a real `<input type="file">` is its own focusable,
clickable, `Enter`/`Space`-activatable control. So it needs to be one directly: `role="button"`,
`tabIndex={0}` when interactive, `onClick`/`onKeyDown` (`Enter`/`Space`) both call the same
`openFilePicker`, and an explicit `aria-label` (`browseLabel`, defaulting to `"Choose file"`)
since there's no native `<label for>` association available for a custom `div` the way a real
`<input>` gets one implicitly.

## `multiple` defaults to `false`, unlike `FileUpload`'s `true`

The reference design shows "Single File" and "Multiple Files" as two distinct, deliberately-named
usages, and a single-line `TextField`-shaped control reads most naturally as single-value by
default — matching a native `<input type="file">`, which is single-file unless `multiple` is set.
`FileUpload`'s dropzone is the opposite by design (it defaults to accepting a batch).

## Single-file mode replaces; it doesn't append

`onFilesAdded`/`onFileRemove` keep the exact same shape as `FileUpload`'s, but single-file mode's
effective cap is hardcoded to 1 (`currentCount` is never read from the existing `files` prop in
that mode) rather than counting the file already there — picking a new file is meant to replace
the old one, not be rejected as "over the limit." This is a documentation convention, not special
component state: see USAGE.md §2 for the "handlers typically replace, not append" note for
single-file consumers. Dropping more than one file onto a single-file control still routes the
extras to `onFilesRejected` via the same effective-cap-of-1 logic, with the default
`maxFilesMessage` reading `"Only one file is allowed"` instead of `FileUpload`'s
`"Maximum of N files allowed"` phrasing.

## Trailing clear button

The clear-all affordance shown whenever `files.length > 0` is a real shared `Button`
(`variant="text" size="small"`, icon-only), not a bespoke `<span role="button">` — it gets real
button semantics and keyboard handling for free, the same reasoning as `Tree`'s expand/collapse
button (see `Tree.module.css`'s `.expandButton`). It's rendered through Button's own tokened
color/disabled states, so `file-input`'s own `properties_colors_trailing-icon` token (and its
`disabled`/`error` state variants) is `recursica-ignore`d rather than applied — it has no
"clear button is disabled" state of its own anyway, since `disabled` already omits interactivity
entirely. Clicking/activating it calls `onFileRemove` once per currently-selected file (reusing
the same callback `FileUpload`'s individual chip removal uses, rather than introducing a separate
`onClear` prop) — in single-file mode that's one call; in multiple-file mode it clears everything
at once, distinct from a chip's own individual remove icon.

## Why each chip is wrapped with its own `stopPropagation`

`FileUpload`'s chip list sits _below_ its dropzone, entirely outside the click-to-browse surface,
so a click on a chip's body never risks also opening the file picker. `FileInput`'s chip row lives
_inside_ the same clickable root, so each chip is wrapped in a thin `<span onClick={(e) =>
e.stopPropagation()}>` — blank space within the row (and the leading icon/placeholder/filename
text) still bubbles up to open the picker, but clicking directly on a chip's body doesn't also
trigger it. Chip's own remove icon already calls `stopPropagation` internally (see `Chip.tsx`), so
it needed no changes for this.

## Keyboard navigation for the chip row

Same roving-tabindex model as `FileUpload`'s file list (`activeChipIndex`, `removeIconRefs`,
Left/Right/Up/Down roving, focus-survives-removal `useEffect`) — reused rather than reinvented,
and applies in single-file mode too (a one-chip roving group is a no-op but needs no special
casing). The only addition specific to `FileInput` is that `Tab` reaches the root control itself
first (since it's the click/keyboard surface for opening the picker), _then_ the chip row's
roving group, _then_ the trailing clear button as its own stop.

## The chip row scrolls horizontally instead of wrapping or clipping

`.chipRow` uses `overflow-x: auto; overflow-y: hidden` rather than `FileUpload`'s file list, which
wraps onto multiple lines below the dropzone — `FileInput` is a fixed single-line, `min-height`d
control, so wrapping would grow it vertically. Enough chips to overflow the control's own width
scroll horizontally within it instead (mouse wheel/trackpad or a native scrollbar), same tradeoff
already made for `.value`'s ellipsis truncation.

## Read-only vs disabled

`readOnly` renders the same content (placeholder/filename/chip row) but the root loses its
`role="button"` interactivity (no `tabIndex`, no click/keyboard/drag handlers), chips render with
no `removeLabel`/`onDelete` (so `Chip` itself renders no remove icon, same as `FileUpload`'s
read-only chips), and the trailing clear icon is omitted entirely. `disabled` keeps the control
structurally the same but inert (`tabIndex={-1}`, `aria-disabled`, no handlers, native `<input>`
disabled) — both are computed together as a single `interactive` flag used throughout, but remain
independently toggleable props (a `readOnly` control is never simultaneously `disabled` in
practice, but nothing enforces that at the type level, matching `FileUpload`'s own convention).
