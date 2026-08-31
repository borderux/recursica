# Tabs Implementation Notes

- **Compositional API Dropped:** Mantine uses `<Tabs.List>`, `<Tabs.Tab>`, and `<Tabs.Panel>` natively with implicit context from `<Tabs>`. MUI relies on `@mui/lab/TabContext` and separates `Tabs` and `TabPanel`.
- **Monolithic API Adopted:** Following architectural review, we have opted to drop the broken dot-notation wrappers for `mui-adapter`. We now natively export `Tabs` (MUI List), `Tab` (MUI Item), and `TabPanel` (from `@mui/lab`). Developers must use `TabContext` (from `@mui/lab`) to manage state, just like native MUI. Storybook and visual regression tests have been updated to reflect this divergence while retaining core property mapping compatibility.

## Traps found via adapter-tester parity fixing (2026-08-15)

- **`Tabs` doesn't read `TabContext`:** only `TabPanel` (from `@mui/lab`) consumes it. `Tabs` (from `@mui/material`) needs its own explicit `value` prop or every tab renders permanently unselected (no error, just silently inert). See USAGE.md's warning callout.
- **`TabPanel` is a DOM sibling of `Tabs`, not nested inside it:** any `.root .panel`-style descendant selector in this file silently never matches. Scope panel rules off the bare class instead. Consumers must also wrap both in their own column-direction container (Storybook does this via `Flex`) — otherwise the panel renders beside the tab list, not below it, because there's nothing else establishing the block stacking.
- **`.Mui-selected` needs `:global(...)`:** written bare in a `.module.css` file, CSS Modules locally scopes it to something like `.Tabs-module__Mui-selected___xxx`, which never matches the real MUI-applied class. Every reference to a native MUI state class in this file must be `:global(.Mui-selected)`, not `.Mui-selected`. (SegmentedControl's `.control.Mui-selected` has this exact same latent bug — not fixed as part of this pass, flagged separately.)
- **MUI's Tab defaults to `min-height: 72px`** for icon+label tabs (48px otherwise); Mantine's tab height is purely padding/content-driven. Reset to `min-height: auto` or the whole row renders visibly taller than Mantine's.
- **MUI's `TabPanel` defaults to `padding: theme.spacing(3)` (24px)**; Mantine's `Tabs.Panel` has none — the gap is already carried by `.list`'s own margin. Reset to `padding: 0`.
- **The indicator (`classes.indicator`) is absolutely positioned against `.MuiTabs-root`, not `.list`:** `.list`'s own `margin-bottom` (the tabs-content-gap) collapses into that root's auto height instead of stopping at `.list`'s border edge, so the indicator's default `bottom: 0` lands one content-gap below the baseline. Offset it by the same content-gap token to bring it flush again.
- **All of the above needed `!important`** to reliably beat MUI's own emotion-injected styles for the same property — plain specificity/cascade order wasn't sufficient in this build.

## Follow-up parity fixes (2026-08-18)

- **`MuiTouchRipple-root` gets caught by `.root .tab > *`:** that rule exists to lift real content (icon/label) above the hover overlay's `z-index`, but it also matches the ripple span MUI injects into the tab on first click. Forcing that span from its native `position: absolute` to `position: relative` turns it into a real flex item, inserting one extra `--tabs-element-gap` into the tab's flex row and permanently growing the tab's width (it never gets removed from the DOM after the ripple animation ends) — this was the cause of a layout shift where selecting a tab pushed later siblings sideways. Excluded via `:not(:global(.MuiTouchRipple-root))`.
- **Outline's selected-tab border can't be "erased" with a same-element pseudo-element:** the open edge (0 border-width on the side touching the list's baseline) leaves the list's own `border-bottom`/`border-right` showing through, because that border is a real CSS border appended outside the tab's box, not an inset overlay sharing the tab's own bottom edge (unlike Mantine, where the list-baseline wrapper and the tab share the same reference edge, so the tab's own border naturally paints over it). A `::after` patch on the tab itself can't fix this either: MUI gives `Tab` (`ButtonBase`) `overflow: hidden` natively (to contain the ripple), which clips away anything extending past the tab's own box before it ever reaches the list's border. Fixed by repurposing the indicator element (`classes.indicator`) instead — it already lives in the scroller (a sibling of `.list`, not clipped) and MUI already keeps its position/size in sync with whichever tab is selected, so it just needed restyling into a small opaque patch instead of being `display: none`.
- **That patch needs a real opaque color, not the tab's own token:** outline's active background-color token is `transparent` by design (it's meant to let the ambient Layer surface show through), so it can't double as the eraser — painting "transparent over transparent" does nothing. Used `--recursica_brand_layer_0_properties_surface` (the default/outermost Layer surface) instead, since that's what a Tabs instance sits on absent an explicit wrapping `<Layer>`. This is an inherent approximation, same category as Mantine's own equivalent trick (which hardcodes `--mantine-color-body`): if a consumer nests outline Tabs inside a `<Layer layer={1|2|3}>`, the patch will mismatch that surface's color. No generic "current ambient layer" token exists in the schema to fix this properly — flagged for whoever owns the token schema.
- **Vertical `.list` doesn't stretch to the root's full height:** Mantine's vertical `.list` stretches via flex `align-items`, so its `border-right` divider runs the whole rail. MUI's scroller (the `.list`'s parent) is a plain block for vertical, not a flex container, so `.list` sizes to just its stacked tab content and the divider stopped at the last tab. Fixed with an explicit `height: 100%` on `.list` for vertical orientation.
- **Vertical indicator needs the same content-gap offset as horizontal, rotated 90°:** the list's `margin-right` (vertical's tabs-content-gap) inflates the root's auto width past the list's own border-right edge, same mechanism as the existing horizontal `bottom` offset trick — without a matching `right` offset, the indicator renders content-gap pixels to the right of the divider instead of on it.

## `inverted` never actually moved the tab list below the content (2026-08-30, source-of-truth audit)

**Reported symptom:** in the `Inverted` story, content should render above the tab list (tabs
below), with padding between them — the padding looked missing "when content is on top".

**What was actually happening (both adapters):** `inverted` already worked for its _documented_
scope — flipping the active-indicator line and border-radius direction (top vs bottom) via
`data-inverted` selectors already in this file — but neither adapter actually repositioned the
tab list below the panel content. The story always renders `<Tabs>` before `<TabPanel>` in JSX
regardless of `inverted`, so "padding missing when content is on top" wasn't reproducible as
such: content was never on top to begin with, in either adapter, before this fix.

**Fix:** per USAGE.md, consumers already wrap `Tabs`+`TabPanel` in their own column-direction
`Flex` — meaning this component's own root and each `TabPanel` are real flex siblings under that
consumer container. Added `.root[data-orientation="horizontal"][data-inverted] { order: 1; }`
(scoped to horizontal only — vertical's "instead of left" flip isn't exercised by any story) so
the tab list visually moves after every `TabPanel` (which stay default `order: 0`) with zero DOM
changes. Also introduced a shared `--tabs-content-gap` custom property per variant (previously
each variant inlined its own long token reference directly into `.list`'s `margin-bottom`) so the
same gap can be redirected: `margin-bottom: 0; margin-top: var(--tabs-content-gap);` when
inverted, since the gap now needs to land above the now-trailing tab list instead of below it.
The existing indicator `bottom`/`top` offset math elsewhere in this file needed no changes — it
positions the indicator within `.root`'s own local box, which is unaffected by where flex `order`
places that whole box among its siblings. Verified live against mantine-adapter's identical fix
(see its own `Tabs/IMPLEMENTATION_NOTES.md`) — pixel-equivalent stacking order and gap.

## Vertical `inverted` — "instead of left" flip (Matt Massey, ROUND 2 2026-08-31)

**Reported symptom:** no story exercises `orientation="vertical"` + `inverted` in either adapter
(flagged as an open question, unimplemented, in the prior round). After toggling it live, MUI's
red active-indicator line floated disconnected from the grey divider below it.

**Root cause:** the horizontal `inverted` fix above was explicitly scoped to
`[data-orientation="horizontal"]` only — none of its `order`/margin/indicator/border/radius rules
applied to vertical, so `inverted` on a vertical Tabs silently did nothing: the list stayed on the
left, but the divider/indicator's `right`-side offsets stayed anchored to a content-gap margin
that no longer existed once toggled (`.list`'s margin-right token expects the panel to still be
on its right), producing the disconnected look.

**Fix:** mirrored the horizontal flip rotated 90°, for `[data-orientation="vertical"][data-inverted]`:
`order: 1` on `.root` (list moves after the panel in the consumer's row `Flex`), `.list`'s
content-gap margin flips from `margin-right` to `margin-left`, the divider flips from
`border-right` to `border-left`, the indicator's offset flips from `right` to `left` (both the
default variant's underline and outline's baseline patch), and tab border-radius/outline
open-edge geometry flip from left-rounded/right-open to right-rounded/left-open. Verified live via
DOM attribute injection (no story exists yet to exercise this combo automatically) — divider and
indicator render flush on the list's new left edge, list correctly moves to the right of the
panel. mantine-adapter has the same "vertical inverted unimplemented" gap and wasn't touched here
(out of scope — only the MUI symptom was reported); flagged in `OPEN_QUESTIONS.txt` for parity.

## Ripple removal (2026-08-19)

- **MUI `Tab` shows a click ripple; Mantine's has none.** `Tab` extends `ButtonBase`, which renders a `TouchRipple` on click by default. Fixed by passing `disableRipple` on `MuiTab` in `Tab` (the same official escape hatch already used by `Button`/`Switch`/`Radio`/`Checkbox`). With `disableRipple`, the `MuiTouchRipple-root` span is never rendered at all, which also makes the `.root .tab > *:not(:global(.MuiTouchRipple-root))` layout-shift workaround above moot going forward (left in place defensively).
