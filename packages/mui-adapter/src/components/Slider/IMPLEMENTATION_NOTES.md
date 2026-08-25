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

## 6. No Dual-Thumb / Range Support

**Decision:** Requested (MUI's `Slider` already accepts `number[]` for `value`/`onChange` and renders multiple thumbs natively), declined — no current use case needs it. `Slider` stays single-thumb only; `value`/`onChange` remain typed as `number` and arrays continue to be collapsed to `value[0]`.
