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
