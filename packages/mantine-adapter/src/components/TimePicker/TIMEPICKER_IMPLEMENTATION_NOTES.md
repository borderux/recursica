# TimePicker Implementation Notes

## Architecture Overview

`TimePicker` is a composite of two independently-styled controls sitting side by side in a flex row:

1. **The time field** — Mantine's own `TimePicker` component (not `TimeInput` — a separate, more advanced component in the same package with real segmented hour/minute/second masking), always rendered with `format="12h"`.
2. **The AM/PM selector** — `BareDropdown`, a headless variant of this adapter's own `Dropdown` component (see below), not a native `<select>`.

This shape is deliberate and **not configurable** — there is no prop to get a plain 24-hour input or to hide the AM/PM control. Every consumer gets the same 12-hour + Dropdown-styled-AM/PM composite.

## Why not just Mantine's `TimePicker` alone

Mantine's `TimePicker` with `format="12h"` already renders hour/minute masking **and** an AM/PM control together — but that control is a native HTML `<select>` (`AmPmInput`, rendered via `format === "12h" && <AmPmInput />` in Mantine's own source, unconditionally bundled with 12h format — there's no prop to get one without the other). A native `<select>`'s styling is limited, especially its open option list (browser/OS-rendered), so it doesn't visually match Recursica's `Dropdown` component. (Matt Massey, 2026-08-07, after reviewing the initial native-select version in Storybook.)

Resolution: keep Mantine's `TimePicker` for what it does well (real, accessible 1-12 hour + minute + second masking with proper keyboard navigation — not something worth rebuilding from scratch), **CSS-hide its bundled native AM/PM `<select>`** (`.timeWrapper :global([data-am-pm]) { display: none; }`), and drive AM/PM entirely through our own `BareDropdown` next to it.

## `BareDropdown`

A new, **internal-only** component in `../Dropdown/BareDropdown.tsx` — not exported from this folder's `index.ts` (there isn't one; the barrel export is at the package level and only references `Dropdown`, not `BareDropdown`). It's the same `MantineSelect` primitive `Dropdown` wraps, styled via the **same** `Dropdown.module.css` classes (`wrapper`/`input`/`section`/`dropdown`/`option`), but with no `FormControlWrapper`/`WithReadOnlyWrapper` and no label/assistiveText/error/required props.

**Why not the public `Dropdown` component directly**: `Dropdown` wraps its own `FormControlWrapper`/`FormControlLayout` internally (it's meant to be used standalone). Nesting the full `Dropdown` inside `TimePicker` — which is already `FormControlWrapper`-wrapped — would double up `FormControl`/`FormControlLayout` structure. `BareDropdown` is the headless escape hatch for exactly this situation: reuse `Dropdown`'s visual styling without its structural wrapping. (Matt Massey, 2026-08-07.)

## Internal state, unlike every other component here

Every other input in this adapter is a thin pass-through — the wrapped library component owns all interaction state. `TimePicker` is the exception: the time field and the AM/PM `BareDropdown` both mutate the _same_ conceptual value, so something has to reconcile them. `TimePicker.tsx` keeps a `useState<string | undefined>` for the full 24-hour `"HH:mm[:ss]"` value, seeded from `value`/`defaultValue`, synced when `value` changes (controlled usage), and updated by both controls (the field's own `onChange`, and the `BareDropdown`'s `onChange` — which just adds or subtracts 12 from the current hour). The public `value`/`onChange` API is unaffected — still the same plain string convention as always.

## Hidden/omitted native props

Because the AM/PM behavior is fixed, several of Mantine's `TimePicker` props are **omitted from the public API** rather than exposed and silently ignored — a consumer shouldn't be able to pass a prop that looks like it should do something (change format, relabel the native AM/PM control) when it can't:

- `format`, `min`, `max` — hardcoded/remapped internally (`format` always `"12h"`; `min`/`max` come from `minTime`/`maxTime` instead, matching the shared `RecursicaTimePickerProps` contract).
- `amPmInputLabel`, `amPmLabels`, `amPmSelectProps`, `amPmRef` — all control the native AM/PM `<select>`, which is now CSS-hidden and non-interactive. Exposing these would be misleading.
- `withDropdown`, `presets`, `maxDropdownContentHeight`, `scrollAreaProps`, `reverseTimeControlsList`, `popoverProps` — the optional time-presets popover feature isn't wired up; kept out of the public API to keep it minimal.

## Design tokens

- No dedicated `min-height` token exists for `time-picker` (unlike `text-field`/`date-picker`) — `.fieldsGroup`'s explicit `height` is derived from `text_line-height` instead, which also fixes a real bug: Mantine's own field CSS sets `height: 100%` on every field to fill `.fieldsGroup`, and a percentage height only resolves against a _concrete_ parent height. Before this, `.fieldsGroup` was auto-height (padding only), so `100%` resolved to `0` — this is why the AM/PM control was invisible in early builds (verified via real headless-browser inspection, not just markup checks — a raw server-render test had missed this entirely since it doesn't compute layout).
- `icon-size`/`icon-color`/`icon-text-gap`/`placeholder-opacity` are exempted (`recursica-ignore`) — the time field has no icon slot and no native `::placeholder` pseudo-element to target (each `SpinInput`'s `"--"` placeholder is styled internally by Mantine).
- The AM/PM `BareDropdown` draws its own border/background/padding from `Dropdown`'s own tokens via `Dropdown.module.css` — it does not reuse any `time-picker` tokens.

## Read-Only Implementation

`readOnlyType="text"`, matching `DatePicker`'s convention.

## Visual review fixes (Matt Massey, 2026-08-07)

Follow-up fixes after the first Storybook review of the `BareDropdown`-based rebuild:

- **Outer box was ~62px tall instead of matching `TextField`'s 48px**: Mantine's `TimePicker` renders its `classNames.input` slot as a real, separately-styled box (its own border, background, and `min-height: var(--input-height)` = 36px by default) nested _inside_ `classNames.wrapper` — not a plain content container. Left alone, that gave every field a second, competing Mantine-default border/background stacked underneath our own `.timeWrapper` chrome. Fixed by resetting `.timeInput` (mapped to `classNames.input`) to a bare, unstyled flex shell (`border: none; background-color: transparent; padding: 0; height: auto; min-height: 0;`) — every visual property now lives on `.timeWrapper` alone. Confirmed by reading Mantine's `Input.mjs`/`use-input-props.mjs` source directly, not just trial-and-error CSS.
- **No dedicated `min-height` token for `time-picker`** (unlike `text-field`): `.timeWrapper` now sets `min-height: var(--recursica_ui-kit_globals_form_field_size_single-line-input-height)` — the same global `text-field`'s own `min-height` token itself resolves to (confirmed via `recursica_variables_scoped.css`), so both land on exactly 48px without binding to another component's own namespace.
- **No dedicated gap token between the time field and the AM/PM dropdown**: checked `ui-kit.globals.form.properties` — the closest candidates (`label-field-gap-horizontal`, `vertical-item-gap`) are for label-to-field and vertical stacking, not a horizontal gap between two sibling controls. `.root`'s flex `gap` continues to reuse `time-picker`'s own `horizontal-padding` token as a stand-in until a real token exists.
- **AM/PM `BareDropdown` was as wide as the time field**: two stacked causes, both now fixed:
  1. A plain `style={{ width: "fit-content" }}` prop doesn't reach the bordered box at all — Mantine's `useInputProps` routes a top-level `style` prop to the _label_ `InputWrapper`, not the input box. Fixed by using the styles-api `styles={{ wrapper: { width: "fit-content" } }}` prop instead, which targets that box directly.
  2. Even with that fixed, the box stayed wide: `Dropdown.module.css`'s `.input` sets `width: 100%`, and a native `<input>`'s own intrinsic/`auto` width is a fixed browser default (~20 characters), not based on its actual "AM"/"PM" value text, so resetting to `auto` alone didn't shrink it either. Fixed with an explicit small width (`.amPmSelect :global(.mantine-Select-input) { width: 2.5rem; }`, targeting Mantine's stable global class since this module can't reference `Dropdown.module.css`'s own hashed class name) — the wrapper's rendered width just follows this input, since `Dropdown.module.css`'s right-section icon is positioned absolutely and doesn't add to flex flow.

## Visual review round 2 (Matt Massey, 2026-08-08)

- **AM/PM box was too tight — 2.5rem left no room for the "AM"/"PM" text or breathing room around the chevron**: `2.5rem` (40px) is a `box-sizing: border-box` width, so it has to fit Dropdown's own left padding (16px) _and_ its right padding reserved for the chevron section (48px, `horizontal-padding + icon-size + icon-text-gap`) inside it — that's 64px of padding alone, more than the 40px box, leaving a _negative_ content area (hence the invisible value and the chevron crowding the border). Widened to `6rem` (96px), leaving a real ~32px for the text.

## Visual review round 3 (Matt Massey, 2026-08-08) — AM/PM value now defaults and persists

Previously flagged as a known limitation, now fixed: Mantine's own `TimePicker` only reports a valid `onChange` value once its internal `amPm` state is non-`null` (see `getTimeString` in `@mantine/dates`) — that state is normally set by interacting with the native AM/PM `<select>`, which this component CSS-hides entirely. In practice, typing hour/minute digits alone never fired a valid `onChange`, so the AM/PM `BareDropdown` stayed blank forever and selecting a value there did nothing (its own `handleMeridiemChange` logic bailed out early, since `hour` was always `undefined`).

**Fix**: `convertTimeTo12HourFormat` in `@mantine/dates` derives `amPm` from whatever `hours` value it's given — `null` only when `hours` itself is `null`. And `onAmPmChange` (Mantine's internal handler for the — hidden — native select) calls `setAmPm(value)` _unconditionally_, before any validity check. So simulating one real interaction with that native `<select>` — defaulting it to "AM" — permanently seeds Mantine's internal `amPm` state, after which typing hour/minute correctly resolves and reports a real value, and our own `BareDropdown` (which drives the same native select the same way) correctly displays and changes it.

Implementation: a `useEffect` on mount, gated to only run when there's no real initial `value`/`defaultValue` already (Mantine already derives the correct AM/PM from a real value on its own — this only fixes the genuinely-empty-start case). It sets the native select's `.value` via `Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set` (required to make a React-controlled element pick up a value set outside of React) and dispatches a `change` event — access to the native element comes via `amPmRef`, a prop omitted from this component's own public API but still usable internally when calling Mantine's `<TimePicker>` directly.

## Visual review round 6 (Matt Massey, 2026-08-17) — AM/PM dropdown blank until an hour is typed

Round 3 fixed Mantine's internal `amPm` state never becoming valid (the deadlock preventing `onChange` from ever firing). It did not fix a separate problem: the visible `BareDropdown`'s own `value` prop was computed as `hour === undefined ? null : isPM ? "PM" : "AM"` — explicitly `null` whenever no hour had been typed yet, so the control displayed empty on mount even though round 3's mount effect had already seeded Mantine's hidden native `<select>` to "AM". Those are two different pieces of state: the hidden native select (round 3's fix target) and `internalValue`/`hour` (what `BareDropdown` actually renders), and writing to one never touched the other.

The MUI adapter's equivalent (`mui-adapter/src/components/TimePicker/TimePicker.tsx`) never had this problem — its `isPM` is a plain boolean (`internalValue ? internalValue.hour() >= 12 : false`) with no `null`/"unset" branch, so its dropdown always renders a concrete "AM"/"PM".

**Fix**: dropped the `null` branch — `BareDropdown`'s `value` is now just `isPM ? "PM" : "AM"`, matching MUI. `isPM` already evaluates `false` when `hour` is `undefined`, so this alone makes the dropdown default to "AM" with no other changes.

Note: selecting AM/PM before any hour is typed is still a no-op in both adapters (`handleMeridiemChange` bails out when `hour`/`internalValue` is undefined) — that's pre-existing, shared behavior in both adapters, not something this fix touches.

## Visual review round 5 (Matt Massey, 2026-08-08)

- **AM/PM error-state border wasn't changing**: `BareDropdown` set `data-error`/`data-disabled` via Mantine's `wrapperProps` — which targets the _outer_ `Input.Wrapper` (the label/description/error stacking element), a different, ancestor element from the "wrapper" styles-api slot that actually carries `styles.root`'s border. `Dropdown.module.css`'s `.root[data-error]`/`[data-disabled]` rules never matched as a result. This is the exact same "two different things both called 'wrapper'" trap as the earlier `style` vs `styles.wrapper` bug. Fixed by using `attributes={{ wrapper: {...} }}` instead — the styles-api hook that actually targets the same slot as `classNames.wrapper`. **This is a shared, pre-existing bug** — the real `Dropdown.tsx` had the identical mistake, so its error/disabled states never applied a border color either; fixed there too (low-risk, purely-additive, same reasoning as the `data-selected` fix above).
- **Static/Editable ReadOnly showed the raw 24-hour value with no AM/PM** (e.g. "14:30" instead of "2:30 PM"): `readOnlyValue` was passed the raw internal string as-is. Added `formatReadOnlyTime`, converting to a 12-hour + AM/PM display string before handing it to `WithReadOnlyWrapper`.
