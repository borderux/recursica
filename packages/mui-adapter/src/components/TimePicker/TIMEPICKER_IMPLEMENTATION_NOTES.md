# TimePicker Implementation Notes

## Architecture Overview

`TimePicker` is a composite of two independently-styled controls sitting side by side in a flex row:

1. **The time field** — `@mui/x-date-pickers`'s `TimePicker`, always rendered with `format="hh:mm"` (or `"hh:mm:ss"` with `withSeconds`) — 12-hour digits, no native meridiem section.
2. **The AM/PM selector** — `BareDropdown`, a headless variant of this adapter's own `Dropdown` component (see below), not a plain `Select`.

This shape is deliberate and **not configurable** — there is no prop to get a plain 24-hour field or to hide the AM/PM control. Every consumer gets the same 12-hour + Dropdown-styled-AM/PM composite. (Matt Massey, 2026-08-07 — an earlier revision of this component had a `hideAmPm` prop; it was removed once the design was confirmed fixed, and the shared `RecursicaTimePickerProps` contract in `adapter-common` no longer includes it.)

This was a deliberate choice over a native `<input type="time">`, in exchange for a real clock/list-based time selection UI, at the cost of a new dependency (`@mui/x-date-pickers` + `dayjs`, both added as optional peer deps + a real `dayjs` dependency).

## `BareDropdown`

A new, **internal-only** component in `../Dropdown/BareDropdown.tsx` — not exported from this folder's `index.ts` (which only re-exports `./Dropdown`, not `./BareDropdown`). It's the same `@mui/material` `Select`/`MenuItem` primitives `Dropdown` wraps, styled via the **same** `Dropdown.module.css` classes (`root`/`input`/`icon`/`dropdown`/`option`), but with no `FormControlWrapper`/`WithReadOnlyWrapper` and no label/assistiveText/error/required props. Its `onChange` is normalized to `(value: string | null) => void` (just the selected value), unlike MUI's raw `Select` `onChange`, which hands back a `(event, child)` pair — this keeps its call signature identical to mantine-adapter's `BareDropdown` (whose underlying Mantine `Select` already has a plain-value `onChange`).

**Why not the public `Dropdown` component directly**: `Dropdown` wraps its own `FormControlWrapper`/`FormControlLayout` internally (it's meant to be used standalone). Nesting the full `Dropdown` inside `TimePicker` — which is already `FormControlWrapper`-wrapped — would double up `FormControl`/`FormControlLayout` structure. `BareDropdown` is the headless escape hatch for exactly this situation: reuse `Dropdown`'s visual styling without its structural wrapping. (Matt Massey, 2026-08-07.)

## Internal state, unlike every other component here

Every other input in this adapter is a thin pass-through — the wrapped library component owns all interaction state. `TimePicker` is the exception: the time field and the AM/PM `BareDropdown` both mutate the _same_ conceptual value, so something has to reconcile them. `TimePicker.tsx` keeps a `useState<Dayjs | null>` for the full 24-hour internal value, seeded from `value`/`defaultValue`, synced when `value` changes (controlled usage), and updated by both controls (the field's own `onChange`, and the `BareDropdown`'s `onChange` — which just adds or subtracts 12 from the current hour). The public `value`/`onChange` API is unaffected — still a plain `"HH:mm"`/`"HH:mm:ss"` string; `dayjs` never leaks out.

## `format="hh:mm"` has no meridiem section on purpose

Lowercase `hh` renders 12-hour digits (1–12) with no `a` (meridiem) token, so there's nothing for the user to toggle within the field itself — meridiem is only ever changed via the separate `BareDropdown`. Editing just the hour/minute digits preserves whichever meridiem the current internal value already has, since we always pass a fully-formed `Dayjs` value back into the field (never letting it manage its own uncontrolled state).

## No `variant` prop to force "standard"

`@mui/x-date-pickers` v9's public `TimePicker`/`slotProps.field` API doesn't expose a `variant` prop at all (it's only reachable on an internal `textFieldProps` object this package doesn't surface). The CSS module defensively suppresses **both** the "standard" variant's underline (`::before`/`::after`) and the "outlined" variant's notched-outline, since which one actually renders isn't controllable from here — only one of the two suppressions will ever be doing anything at runtime.

## Design tokens

- No dedicated `min-height` token exists for `time-picker` (unlike `text-field`/`date-picker`) — the field's height is derived from its own padding + line-height instead of a fixed token.
- `icon-size`/`icon-color`/`icon-text-gap` (plus the disabled/error `icon-color` variants) are wired via `leftSection` — see "Leading icon" below.
- `placeholder-opacity` remains exempted (`recursica-ignore`) — MUI X's field renders its empty-state "hh"/"mm" placeholder via its own internal `isFieldValueEmpty` styled-component variant (an inline opacity applied through emotion), not a native `::placeholder` pseudo-element this CSS module can target. Unlike mantine-adapter's `SpinInput` (a real `<input placeholder="--">`), there's no stable selector here to hook a token to without depending on MUI X's internal class names.
- The AM/PM `BareDropdown` draws its own border/background/padding from `Dropdown`'s own tokens via `Dropdown.module.css` — it does not reuse any `time-picker` tokens.

## Known limitation — the popup clock/list view is unstyled

This pass covers the closed-state field and the AM/PM `BareDropdown` only. The open dropdown (digital clock list, depending on `views`) still renders with MUI's default theme, not Recursica tokens — there's no Figma-exported token set for it (mirrors the same category of gap `DatePicker`'s calendar popover has in `mantine-adapter`). Revisit once there's a design spec for it.

## Read-Only Implementation

`readOnlyType="text"`, matching `DatePicker`'s convention.

## Leading icon (Matt Massey, 2026-08-30)

Added `leftSection` (`RecursicaTimePickerProps`), matching `TextField`'s naming/convention: purely decorative, consumer-supplied, no default (unlike `DatePicker`'s fixed `CalendarIcon` — there's no single icon that fits every `TimePicker` use).

MUI X's `TimePicker` has no `leftSection` concept — wired via `slotProps.textField.slotProps.input.startAdornment` (the `textField`/`input` slots are exposed at the top level of `TimePicker`'s own `slotProps`, sibling to `field`, via `PickerFieldUISlotPropsFromContext` — confirmed by reading `useDesktopPicker.types.d.ts`/`PickerFieldUI.d.ts` directly, not just the top-level `TimePickerProps` surface). `startAdornment` renders as a plain sibling of `.MuiPickersInputBase-sectionsContainer` inside `PickersInputBase` (confirmed via `PickersInputBase.js`), so it's wrapped in the same `<div className={styles.section} data-position="left">` shape `TextField.tsx` already uses, rather than depending on MUI's own adornment styling. Also added `data-with-left-section` on `.root` so `.MuiPickersInputBase-sectionsContainer`'s own hardcoded `padding-left` (previously always the field's full `horizontal-padding`, structured for the no-icon case) collapses to just `icon-text-gap` once the icon itself is doing the border-inset job instead.

## Visual review fix (Matt Massey, 2026-08-07)

**`BareDropdown`'s border color didn't match Mantine's version, despite both reading the same `Dropdown` tokens**: a real bug in `BareDropdown.tsx` — `className={styles.root}` was set explicitly on `<MuiSelect>`, then `{...sanitizedProps}` was spread _after_ it. Any caller passing its own `className` (like `TimePicker.tsx`'s `styles.amPmSelect`) silently overwrote `styles.root` entirely via that later spread, so `Dropdown.module.css`'s border-color/background/`width: 100%` never actually applied — MUI's own default border rendered instead. Fixed by extracting `className` explicitly and merging it (`` `${styles.root} ${className}` ``) before it reaches `<MuiSelect>`, the same pattern mantine-adapter's `BareDropdown` already used. This also explains why the AM/PM box's width had looked accidentally "correct" before: the competing `width: 100%` rule from `.root` was never actually being applied either.

## Visual review round 2 (Matt Massey, 2026-08-08)

- **Time field's default clock icon removed**: `time-picker`'s own token schema has no icon slot (see EXEMPTIONS above) and the popup it opens isn't styled to Recursica tokens anyway (see "Known limitation" below) — showing a button to open an unstyled popup was worse than not showing one. Removed via `slots={{ openPickerButton: () => null }}`; this also shrank the field's own width back down, since the icon's reserved layout space is gone.
- **AM/PM `BareDropdown` looked shorter than the time field and had a doubled border**: a latent, pre-existing bug in the _shared_ `Dropdown.module.css`, not something new in this composite — confirmed the standalone `Dropdown` component has the exact same issue (measured its own `.input` box at 42.8px instead of the 48px `min-height` token). Root cause: MUI generates a compound class for the select's inner box (e.g. `.css-xxx-...-MuiSelect-select`) that sets its own `min-height: 1.4375em` (~23px) — two classes' worth of specificity, which beats `Dropdown.module.css`'s single-class `.input` rule, so the 48px token silently loses. Separately, MUI's outlined variant renders its own native `fieldset`/`notchedOutline` border _underneath_ `.input`'s own Recursica border — the second border Matt saw. Both fixed **scoped to this composite only** (`.amPmSelect :global(.MuiSelect-select) { min-height: ... !important }` + suppressing `.MuiOutlinedInput-notchedOutline`), matching the same technique already used to suppress the time field's own native decoration — _not_ fixed in the shared `Dropdown.module.css`, since that would change the standalone `Dropdown` component everywhere in the app, outside this component's scope. Flagged to Matt as a separate, real bug worth a dedicated fix.

## Visual review round 3 (Matt Massey, 2026-08-08)

- **AM/PM value wasn't vertically centered**: a side effect of the round-2 min-height fix above — forcing the box to 48px left real slack below the text (`display: block`, top-aligned line box), which reads as "not centered" once the box is taller than its own padding + line-height. Added `display: flex; align-items: center` to the same scoped override so the slack distributes evenly instead.
- **AM/PM dropdown menu showed MUI's default blue selected-state tint instead of Recursica's**: `Dropdown.module.css`'s `.option[data-selected="true"]` rule (Recursica's neutral hover/selected tint) was never actually wired up — neither `Dropdown.tsx` nor `BareDropdown.tsx` ever set `data-selected` on the currently-selected `MenuItem`, so MUI's own `Mui-selected` class (with its default primary-blue background) rendered uncontested instead. This is a **shared, pre-existing gap** affecting the real `Dropdown` component too, just not visible there by default (`Dropdown`'s own default story has no value pre-selected, so nothing shows the tint) — unlike `TimePicker`'s AM/PM, which always has a value. Fixed in **both** `Dropdown.tsx` and `BareDropdown.tsx` (compare each `MenuItem`'s value against the select's current `value`/`defaultValue`) since this is a low-risk, purely-additive fix completing an already-designed CSS contract, not a new design decision — unlike the min-height/border fix above, which changes visual geometry and was deliberately scoped to this composite only.

## Visual review round 4 (Matt Massey, 2026-08-08) — time field width

The time field itself rendered wider than intended (220px vs. the 130px `time-picker.properties.width` token), despite `.field { width: fit-content }` already being set. Root cause: `@mui/x-date-pickers` computes and inline-sets a literal pixel width on `.MuiPickersInputBase-sectionsContainer` based on the format string (182px for "hh:mm") — sized generously for the widest possible rendered value, independent of `.field`'s own width. Reset via `.field :global(.MuiPickersInputBase-sectionsContainer) { width: auto !important; flex-grow: 0 !important; }` — safe here because these are real text `<span>`s (not native `<input>`s), so `auto` sizes to their actual content correctly, unlike the native-`<input>`-in-`BareDropdown` case elsewhere in this file, where `auto` alone didn't help. Now matches Mantine's `.timeWrapper`'s 130px exactly.

## Visual review round 5 (Matt Massey, 2026-08-08)

- **AM/PM error-state border wasn't changing**: `Dropdown.tsx`'s error/disabled state was set via `inputProps` (`data-error`/`data-disabled`), which only reaches the nested accessibility `<input>` — a different element from `.root` (the actual Select root carrying the border), which is what `Dropdown.module.css`'s `.root[data-error]`/`[data-disabled]` selectors require. The error border never actually applied, in the real `Dropdown` component or `BareDropdown`. Fixed by also setting `data-error`/`data-disabled` directly as top-level props on `<MuiSelect>` (they land on its root element) in both `Dropdown.tsx` and `BareDropdown.tsx` — the latter also needed an `error?: boolean` prop added to its own interface, since it previously had none.
- **Static/Editable ReadOnly showed "Invalid Date" instead of a value**: a real, separate bug — `toDayjs`'s 2-argument `dayjs(value, format)` call silently does nothing without the `customParseFormat` plugin registered; without it, dayjs falls back to native `Date` parsing, which fails on a bare "HH:mm" string (no date component). This went unnoticed until now because every prior interactive test produced `Dayjs` objects directly from the picker's own `onChange`, never actually exercising `toDayjs` with a real initial `value`/`defaultValue` string. Fixed by adding `dayjs.extend(customParseFormat)`.
- **Static/Editable ReadOnly showed the raw 24-hour value with no AM/PM** (e.g. "14:30" instead of "2:30 PM"): `readOnlyValue` was passed the raw internal string as-is. Added `formatReadOnlyTime` (uses `toDayjs` + dayjs's own `.format("h:mm A")`) before handing it to `WithReadOnlyWrapper`.
