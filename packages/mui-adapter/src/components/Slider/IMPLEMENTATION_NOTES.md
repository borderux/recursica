# Slider Implementation Notes

This document contains specific design decisions, architectural constraints, and hacks required to bridge the Recursica design system with MUI's underlying `Slider` primitive.

## 1. Pointer Clicks Falsely Trigger MUI's `Mui-focusVisible` Ring

**Symptom:** Clicking or dragging the thumb showed the keyboard focus ring, which Mantine never shows for a plain mouse interaction.

**Root cause:** MUI's `Slider` always programmatically re-focuses its hidden native `<input type="range">` on pointer-down (`focusThumb()` in `useSlider`). Because the focus target (`<input>`) differs from the element the pointer actually interacted with, and because a script-driven `.focus()` call is what browsers use to decide visibility, the native `:focus-visible` heuristic (which MUI's own `isFocusVisible` check relies on) resolves to `true` even for a plain click. Mantine's thumb is a plain `<div tabIndex>` that receives real native focus directly from the click, so the same heuristic correctly resolves to `false` there.

**Fix:** `Slider.tsx` tracks pointer-vs-keyboard itself (`onMouseDown` sets a ref, `onFocus` reads it to flag `suppressFocusRing`, `onKeyDown`/`onBlur` clear it — mirroring how real `:focus-visible` re-evaluates on a subsequent keypress). `Slider.module.css` only paints the ring when `[data-suppress-focus-ring="true"]` is absent from `.sliderContainer`.

## 2. Disabled Track Stayed Red

**Symptom:** Once `disabled` was wired through correctly, the filled track (`.sliderBar`) still rendered the active/red color instead of the disabled grey token.

**Root cause:** The base `.sliderBar` rule had `background-color: ... !important`, so the (non-`!important`) `[data-disabled="true"] .sliderBar` override could never win the cascade regardless of source order.

**Fix:** Removed the unneeded `!important` flags from the base `.sliderBar` rule — `injectFirst` already makes our CSS-module class beat MUI's native `.MuiSlider-track` via source order alone (same as `.sliderTrack`/`.sliderThumb`/`.sliderMark`, none of which need `!important`).

## 3. Assistive Text Rendered as `<div>` Instead of `<span>`

**Root cause:** `AssistiveElement.tsx` (mui-adapter) hardcoded a `<div>` around the children text; Mantine's equivalent uses a `<span>`. Not shared via `adapter-common` — each adapter has its own `AssistiveElement`.

**Fix:** Changed the inner text wrapper to a `<span>`. No CSS selector depended on the element type (`.text` is a class-only selector and remains a valid flex item as a span).

## 4. Mark Label Color

**Root cause:** MUI's `.sliderMarkLabel` already inherited the container text color using the min-max-label typography tokens. Mantine's equivalent class (`styles.sliderMarkLabel`) was referenced in `Slider.tsx`'s `classNames` map but was never defined in Mantine's `Slider.module.css`, so Mantine silently fell back to its own default theme grey instead of any recursica token. Fixed in `mantine-adapter` by adding the missing `.sliderMarkLabel` rule (same tokens/inherit-color approach as MUI) rather than copying Mantine's undefined behavior into MUI.

## 5. Formatted Current Value, Label Overrides, Trailing Icon

**Symptom:** `.currentValue` always rendered the raw numeric value, even when `tooltipLabel` was a formatter function (already used for MUI's own `valueLabelFormat`) — a caller mapping values onto custom text got the formatted tooltip while dragging but the raw number next to the track otherwise. Same bug as `mantine-adapter`.

**Fix:** `.currentValue` now runs `resolvedValue` through `tooltipLabel` when it's a function, reusing the same formatter passed to `valueLabelFormat`. Added `minLabel`/`maxLabel` (new `adapter-common` props) to override the `.minMaxGuide` text at either end of the track, and `trailingIcon` (new `adapter-common` prop) to render a second icon opposite the existing `icon`, reusing the same `.iconWrapper` styling.

## 6. Dual-Thumb / Range Support

**Decision:** Previously requested and declined (see git history for this section) as no use case needed it; reopened with a full spec and implemented. `value`/`defaultValue`/`onChange`/`onChangeEnd` are now typed `number | [number, number]` in `@recursica/adapter-common`'s `RecursicaSliderProps`.
**Implementation:**

- MUI's `Slider` already accepts `number[]` for `value`/`onChange` and renders two thumbs natively, so unlike `mantine-adapter` (which must swap to a separate `RangeSlider` component) this stays the same `<MuiSlider>` — arrays are no longer collapsed to `value[0]`.
- Internal state (`internalValue`, `resolvedValue`, `inputValue`) generalized from `number` to `number | [number, number]`; range-mode input handlers (`handleLowerInputChange`/`handleUpperInputChange`) clamp each thumb against the other's current value (not the shared `min`/`max`) so the two inputs can't cross.
- `SliderReadOnlyValue` and the floating `.currentValue` display both render `"lower – upper"` for a range value, running each side through `tooltipLabel` independently (`valueLabelFormat` already handled this per-thumb natively, unchanged).
- DOM order in range mode (input → leading icon → min label → track → max label → trailing icon → input) mirrors Forge's own Material/Carbon range layouts — see §7 below.

## 7. Trailing Icon Order Relative to the Input Field

**Decision:** `trailingIcon` previously rendered after the numeric input (`... max label, input, trailing icon`), reversed from Forge's Material/Carbon kits, which always render the trailing icon directly after the max label and before the input.
**Implementation:** Moved `{trailingIconEl}` before the `showInput` input block in the single-value layout; the range layout was built with this order from the start (input → icon → min label → track → max label → trailing icon → input).

## 8. Mark Vertically Off-Center

**Decision:** MUI's own mark is `top: 50%; transform: translate(-1px, -50%)` — the `-1px` assumes MUI's built-in 2px dot, the `-50%` is real vertical centering. `.sliderMark` overrode `transform` to `translateX(-50%)` (horizontal-only, meant to mirror the mantine-adapter) without noticing it dropped MUI's vertical `-50%`, leaving the dot hanging below the track's midpoint instead of centered.
**Implementation:** Changed `.sliderMark`'s transform to `translate(-50%, -50%)` — keeps MUI's vertical centering and swaps the horizontal term to properly center our (non-2px) `step-indicator-width` instead of MUI's hardcoded 1px.
