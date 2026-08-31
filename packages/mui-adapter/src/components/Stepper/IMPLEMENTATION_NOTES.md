# Stepper Implementation Notes

- **Compositional API Dropped:** Mantine manages stepper state and content via `<Stepper.Step>` and `<Stepper.Completed>`. MUI delegates content rendering to the developer and focuses purely on the stepper visual layout using `<Step>`, `<StepLabel>`, etc.
- **Monolithic API Adopted:** Following architectural review, we have abandoned the fabricated context wrappers for `mui-adapter`. We now natively export `Stepper`, `Step`, `StepLabel`, `StepButton`, and `StepConnector` wrapping their `@mui/material` counterparts. Developers are expected to manage the active step logic and content rendering outside the `Stepper` component, consistent with MUI patterns. Storybook tests have been updated to reflect this divergence while retaining core visual compatibility.

## Layout fixes (root-caused against mantine's visual reference)

Several parts of the original implementation used the correct-looking classes but wired
them to elements that never carry those classes at runtime, or copy-pasted comments/logic
from `mantine-adapter` that don't describe how MUI's Stepper actually works. Fixed:

- **Horizontal layout uses `alternativeLabel`:** MUI's own `Stepper` prop doc says
  `alternativeLabel` positions the label under the icon — that's exactly Recursica's
  horizontal layout, and it's also what makes `StepConnector`'s `alternativeLabel` variant
  absolutely-position itself relative to each `Step`, centered on the icon. The adapter
  previously never set this prop and instead tried to force column layout via CSS on
  `Step`'s own root, which has no effect (`StepLabel`'s row-vs-column layout is driven
  entirely by the `alternativeLabel` context flag, not by its parent's `flex-direction`).
  Without it, labels rendered beside the icon (row layout) and the connector used the
  non-`alternativeLabel` inline-flex positioning, both very visibly wrong.
- **Custom `StepIconComponent`:** MUI's default `StepIcon` draws its own self-contained
  circle+check `CheckCircle` SVG (Material's `check_circle` glyph) whenever `completed` is
  true, colored via `theme.palette.primary.main` (blue) — it never reads our tokens and its
  SVG viewBox doesn't scale to `--stepper-indicator-size`. We now pass `RecursicaStepIcon`
  (a plain span + our own inline check glyph, same convention as `Checkbox.tsx`'s `CheckIcon`)
  so the token-driven circle (`.stepIconCircle`) is the only circle ever drawn, and the check
  mark is sized via `--stepper-svg-size` and colored via the `completed-indicator-text` token.
- **`classes.labelContainer` was never mapped:** all of the `.stepBody` centering/max-width
  CSS (copied verbatim from mantine, where `stepBody` is a real classNames key) was dead code
  for MUI — `StepLabel` calls this slot `labelContainer`, not `stepBody`. Now mapped via
  `classes={{ labelContainer: styles.stepBody }}`.
- **Vertical connecting line — real primitive doesn't fit, so it's drawn on `.stepIcon`:**
  MUI's vertical `StepConnector` is a sibling with a fixed `minHeight: 24`; it can't stretch to
  match a step's actual rendered height (e.g. a 2-line description), which is exactly why the
  line floated disconnected from both circles. MUI's own answer to this is `StepContent`
  (its `border-left` spans whatever height its content needs) — but Recursica intentionally
  hides `.content` (steppers are structural-only, no per-step content in the DOM). Since
  neither of MUI's two connecting-line primitives fits, the vertical connector is drawn as a
  `.stepIcon::after` pseudo-element instead: `StepLabelRoot` gets `align-items: stretch` (a
  real CSS stretch, not JS measurement) so `.stepIcon` (`iconContainer`) grows to match its
  sibling label column's actual height, and the rail spans `top: indicator-size` down through
  `bottom: calc(-1 * step-gap)` (the step's own padding-bottom, exactly reaching the next
  step's icon). `Stepper.tsx` passes an empty `<></>` as the vertical `connector` since this
  fully replaces its job. This requires zeroing MUI's own hardcoded
  `StepLabelRoot` vertical `padding: 8px 0` (`.root.vertical .stepLabelRoot`) — leaving it in
  place made the rail land 16px short of the next icon.
- **`:global()` was missing everywhere `.Mui-active`/`.Mui-completed`/`.MuiStepLabel-root` was
  referenced:** in a CSS Module, a bare `.Mui-completed` selector gets scoped/hashed like any
  other local class, so it silently never matches the real global class MUI stamps onto the
  DOM (same pitfall documented in `Button.module.css`/`Switch.module.css` for `.Mui-disabled`/
  `.Mui-checked`). This affected the label/description state-color rules (already present
  before this fix) and the new separator/rail state-color rules — all now wrapped in
  `:global(...)`. While fixing this, the description-color selectors were also corrected to
  use `.stepBody:has(.stepLabel:global(.Mui-completed)) .stepDescription` — the prior
  `:has(~ .Mui-completed)` could never match because `optional`/description renders _after_
  the label in the DOM (not before), and `.MuiStepLabel-root.Mui-completed` could never match
  because MUI only stamps the completed/active state class onto the `label`/`iconContainer`
  slots, never onto `StepLabel`'s own root.

## Source-of-truth audit fixes (2026-08-30)

- **Horizontal connector gap 16px too wide:** MUI's `.MuiStep-root` hardcodes `padding: 0 8px`
  for horizontal steps. The `alternativeLabel` connector centers itself via `left: -50%; right:
50%` relative to each `Step`'s _full_ box width, so that padding (8px from each of the two
  neighboring steps) silently widened every gap by 16px beyond the real `stepBody` content width
  (`--stepper-max-text-width`, 200px in both kits). This didn't show up as a broken-looking line
  in isolation (the circle still visually sits on top of the connector, hiding the seam either
  way — see below) but produced a cumulative rightward drift versus mantine's edge-to-edge gap
  (174px vs. mantine's 158px) that grew step over step, which is what actually reads as "shifted
  ~30px left" by the third step in a side-by-side comparison. Fixed by zeroing
  `.root.horizontal .step`'s padding.
- **The MUI connector element is a center-to-center box hidden by the circle on top, not an
  edge-to-edge box like mantine's:** confirmed via `getBoundingClientRect()` — MUI's connector
  literally spans one circle's center to the next's (`left:-50%/right:50%` against each Step's
  own width), with the `Step`'s own icon painted after it in DOM order so it opaquely covers the
  half of the connector underneath each circle. Mantine's connector is a real `flex:1` box with
  negative margins that trims it to true edge-to-edge. Both approaches render identically once
  the step padding above is fixed (verified pixel-for-pixel via live screenshots) — not changed
  further, since MUI's `alternativeLabel` primitive doesn't support an edge-to-edge box directly
  and the visual result already matches.
- **`ui-kit-stepper--default`'s "Step N content" text belonged to the story, not the component:**
  mui's `Stepper.stories.tsx` rendered an extra `<div>Step {active+1} content</div>` between the
  `Stepper` and the Previous/Next buttons that mantine's equivalent story never had (mantine's
  story passes no children to `Stepper.Step`, so its real `.content` region — hidden by both
  kits' CSS anyway, see "Hide Content" above — stays empty). Removed the extra div from mui's
  story; no component-level bug (mantine's `Stepper` isn't missing a content region — it was
  never asked to render one here).
- **`Group`'s `gap`/margin-padding shorthand props silently multiplied by MUI's theme spacing
  unit:** the stepper story's `<Group mt={24} justify="center" gap={8}>` expects literal pixels
  (matching mantine's `Group`, which takes raw numbers as-is), but `mui-adapter`'s `Group` passed
  `gap` into `Stack`'s own `spacing` prop and spread `mt`/other margin-padding props straight onto
  `Stack`'s system props — both are MUI spacing shorthands that multiply bare numbers by the
  theme's 8px unit (`gap={8}` → 64px, `mt={24}` → 192px). This was the real cause of "Previous/
  Next buttons spaced farther apart" and an oversized gap between the stepper and the button row.
  Fixed in `Group.tsx`: numeric `gap`/`rowGap`/`columnGap` are now stringified to `px` and applied
  via `sx.gap` directly (bypassing `Stack`'s `spacing` prop entirely), and numeric margin/padding
  shorthand keys (`m`/`mt`/.../`py`) are stringified to `px` before being spread onto `Stack`.
  This only affects call sites that pass bare numbers (none elsewhere in this package at the time
  of this fix — `grep`ped for it) since string/token values were already unaffected.
- **`ui-kit-stepper--vertical` spacing too tight:** mantine's real per-step vertical spacing isn't
  actually driven by our own `--stepper-step-gap` token at all — mantine/core's _native_,
  unmodified `Stepper.Step` CSS (`node_modules/@mantine/core/styles/Stepper.css`) ships its own
  `min-height: calc(icon-size + mantine-spacing-xl + separator-spacing)` (≈32px + ≈5px on top of
  the icon), which dominates over our `--stepper-step-gap` (12px) padding since it's larger. This
  is an incidental Mantine library default, not a Recursica token/design decision, but it's what
  actually produces mantine's visible spacing — measured at exactly 79px icon-center-to-icon-
  center vs. mui's un-patched 62.2px. Reproduced via `.root.vertical .step:not(:last-of-type) {
display: flex; min-height: calc(var(--stepper-indicator-size) + 2rem + 0.3125rem); }`
  (`display: flex` is required too, not just `min-height` — without it, `.stepLabelRoot`'s
  existing `align-items: stretch` has nothing taller to stretch to, so the extra height would sit
  as dead space below the row instead of growing `.stepIcon` and, with it, the `.stepIcon::after`
  rail's reach to the next circle). Excludes `:last-of-type`, matching mantine's own `:last-of-
type { min-height: auto }` reset. Verified via live `getBoundingClientRect()` on both kits:
  icon-to-icon spacing now matches at 79px exactly.
- **Description color for completed/current steps was correctly implemented in this package** —
  the visual difference reported against mantine's rendering turned out to be a mantine-adapter
  bug (its `data-progress="completed"/"progress"/"pending"` value-matching selectors never
  matched Mantine's real boolean-presence attributes), not a missing/wrong Recursica variable
  here. See `mantine-adapter`'s own `Stepper/IMPLEMENTATION_NOTES.md`. No mui-adapter change was
  needed for that item.
