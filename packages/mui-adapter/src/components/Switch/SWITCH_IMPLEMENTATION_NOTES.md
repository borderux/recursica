# Switch Implementation Notes

Decisions and gotchas specific to wrapping `@mui/material`'s `Switch` for the UI Kit's Switch.

## Label/description/error

MUI's `Switch` has no built-in label/description/error rendering — built by hand here.
The label is a plain `<label>`; description/error render through the shared
`AssistiveElement` component (`assistiveWithIcon={false}`) instead of local styled divs,
so they inherit real design tokens rather than hardcoded Mantine defaults.

## `Switch.Group` compound export

`SwitchGroup.tsx` existed but wasn't attached as `Switch.Group`. Fixed.

## `SwitchGroup` didn't control its children — now fixed

MUI's `FormGroup` has no controlled-value concept — no equivalent to Mantine's real
`Switch.Group`, which threads a `string[]` of checked values and `checked`/`onChange` to each
child via context. This adapter's `SwitchGroup` used to destructure and discard
`value`/`defaultValue`/`onChange` entirely — purely cosmetic.

Fixed the same way this adapter's own `Checkbox`/`CheckboxGroup` already solved the identical
problem (a closer, in-repo precedent than `Accordion`, which the notes previously pointed to
without checking Checkbox first): a `SwitchGroupContext` provider on `SwitchGroup` carrying
`value`/`onChange`/`name`/`readOnly`, consumed by `Switch` to compute `isChecked` from array
membership and to translate each toggle into an add/remove against that array before calling
the group's `onChange`. Standalone (ungrouped) `Switch` usage is untouched — the group-derived
`checked`/`onChange` are only spread onto `<MuiSwitch>` when a `SwitchGroupContext` is present.
Verified live: initial `value`/`defaultValue` now renders correctly, clicking a sibling
switch toggles only its own entry in the array, and `readOnly` on the group disables every
child — all confirmed against the existing `SwitchGroup.stories.tsx` scenarios via Playwright.

## Thumb icon (check/x glyph)

MUI's `icon`/`checkedIcon` props are the _same mechanism_ MUI uses internally to render its
own default circular thumb (`icon: <the circle>, checkedIcon: <the circle>`, then
spread-overwritten by whatever public `icon`/`checkedIcon` the caller passes) — confirmed
against MUI's own `Switch.js`/`SwitchBase.js` source. Passing a raw glyph into them replaces
the whole thumb circle, it doesn't add an icon inside it.

Fixed the same way `Checkbox` in this adapter already solved the identical problem: build our
own combined node — a `.thumb`-styled `<span>` wrapping `.thumbIconWrapper` with both
`CheckIcon`/`CloseIcon` (inline SVGs, same paths as Mantine's, copied rather than imported
since mui-adapter doesn't depend on `@mantine/core`) — and pass _that same node reference_ as
both `icon` and `checkedIcon` (mirroring MUI's own `icon={icon} checkedIcon={icon}` pattern).
Same reference means it never unmounts/remounts on toggle, which is what lets the two glyphs
crossfade via CSS opacity instead of a hard swap — matching Mantine's `thumbIcon` behavior.
Verified against a live Storybook via adapter-tester (geometry + SVG count now match Mantine
1:1 across Default/Static Variations stories).

## Track/thumb geometry, checked-state selectors, focus ring

Original CSS was a copy of mantine-adapter's file, but MUI's DOM is structurally different
(`track`/`switchBase` are siblings, not nested; MUI hardcodes its own root box, hit-area
padding, and thumb travel distance for its own 20px default thumb). Fixed by driving
`.switchRoot`/`.switchBase`/`.thumb` sizing entirely from our tokens, replacing
`input:checked + .track` sibling selectors (never matched in MUI's DOM) with `:has()`-scoped
selectors, adding an explicit focus ring from `--recursica_brand_states_focus_*` tokens, and
hardcoding `color="default"` so MUI's own primary-blue hover/focus circle never activates.
Verified via live measurement (adapter-tester): track/thumb box dimensions now match Mantine
exactly (64×28 track, 20×20 thumb).

Two gotchas worth flagging for future MUI adapter work:

1. `classes.root` targets MUI's own switch span, but this component's outer wrapper `<div>`
   (switch+label row) also uses `.root` — sizing one squeezes the other. Split into
   `.switchRoot` (MUI switch only) vs `.root` (outer wrapper, cursor only).
2. CSS Modules hashes literal MUI state classes (`Mui-checked`, `Mui-focusVisible`) unless
   wrapped in `:global()` — same pattern already used in `Accordion`/`Button`.

## Disabled-state opacity didn't reach the thumb

**Found 2026-08-14, reported by Matt:** the Read Only story's thumb stayed full-color/opacity
while Mantine's dimmed along with the track. Same root cause as the geometry work above:
Mantine nests `.thumb` inside `.track`, so an `opacity` on `.track` visually dims the thumb for
free; MUI has them as siblings, so the disabled-opacity selectors (which only targeted
`.track`) never touched the thumb at all. Fixed by adding `.thumb` to both selectors alongside
`.track`. Verified live: thumb now dims identically to Mantine in both the plain-disabled and
disabled-checked cases.

## Track opacity — MUI's own always-on defaults, unrelated to our tokens

MUI's `SwitchTrack` styled component sets `opacity: 0.38` unconditionally (its own faded-pill
baseline), and separately `.Mui-checked + .track { opacity: 0.5 }` when checked — neither has
an equivalent in our token schema, and neither was being cancelled. Result: every enabled track
was dimmed by MUI's own opacity, most visibly on the checked state (deep red washed out to
pink). Fixed with an explicit `opacity: 1` in both the base `.track` rule and the
`.root:has(input:checked) .track` rule (needed in both — MUI's checked-specific selector is
more specific than its own base rule, so overriding only the base wasn't enough). Disabled-state
opacity is unaffected; those selectors are already more specific than either of these.

## Focus ring was on the thumb's hit-area circle, not the track

`.switchBase:global(.Mui-focusVisible)` is MUI's actual focusable element, but it's sized to
the thumb's 20×20 hit area, not the 64×28 track — so the ring drew a small circle instead of
outlining the switch. Moved to `.switchBase:global(.Mui-focusVisible) ~ .track` (siblings under
`.switchRoot`, switchBase first) so the ring renders on the track itself. Mantine-adapter had
the mirror-image bug: no override at all, so Mantine's own default outline (blue) showed on the
hidden `<input>` — fixed there with `.root input:focus-visible { outline: none }` +
`.root input:focus-visible + .track { ... }`, drawing the same Recursica-token ring in the same
place.

## `classNames` prop-name bug — external override was silently inert

The external override merge read `restRecord.classNames`, but MUI's actual prop is `classes`
(that's Mantine's naming, copied over by mistake) — fixed. Note only `root`/`track`/
`switchBase` are real MUI `classes` slots; `body`/`trackLabel`/`labelWrapper`/`label` are this
component's own hardcoded elements (styled directly in JSX, not via MUI's `classes` prop) and
remain unreachable through this override path — a separate, pre-existing gap, not something the
prop-name fix could address.

## `SwitchGroup` side-by-side layout always rendered as if stacked

**Found 2026-08-14, reported by Matt:** the `SideBySideLayout` story showed the group label
above the switches instead of beside them. Root cause: `SwitchGroup` passed the switch-item's
own inline label max-width token (200px) as the group's `controlMaxWidth` — but the mandatory
side-by-side label column is a fixed 224px, wider than that cap, so the label always overflowed
onto its own line regardless of layout mode. Reproduced identically in Mantine (same code
pattern, not a MUI-only bug). Fixed by not capping the group's control width at all — each
switch's own label already wraps at 200px via `.labelWrapper`, so no group-level cap is needed.
Verified live in both adapters: side-by-side now shows the label column at left with the
switches beside it; stacked layout unaffected.
