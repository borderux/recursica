# NumberInput Implementation Notes

This document contains specific design decisions, architectural constraints, and hacks required to bridge the Recursica design system with Mantine's underlying `NumberInput` primitive.

## 1. Native Macro Wrapper Bypass

**Decision:** The `<NumberInput>` component explicitly bypasses Mantine's native `Input.Wrapper` DOM injections.
**Implementation:** We pass `label={undefined}`, `description={undefined}`, and `error={undefined}` directly into the primitive `<MantineNumberInput>`. All visual form control geometry is delegated exclusively to our unified `<FormControlWrapper>`, ensuring 100% token adherence for label spacing and assistive text styling without duplicate DOM rendering.

## 2. Right Section & Controls Override

**Decision:** Passing a `rightSection` element will natively remove the increment/decrement arrow controls.
**Implementation:** Mantine inherently renders its stepper controls inside the `rightSection` DOM slot. Providing a custom right-aligned icon or text element intentionally overwrites this slot. If a layout strictly requires both a custom right-aligned element and the stepper controls simultaneously, the integrator must manually rebuild the arrows using Mantine's `handlersRef` within a custom right-section wrapper.

## 3. Controls Styling

**Decision:** The increment/decrement control arrows rely partially on native Mantine CSS inheritance.
**Implementation:** The current Recursica design system tokens do not provide explicit UI styling parameters (`background`, `border`, `hover` states) for the inner number-input arrows. We have explicitly removed Mantine's default borders to cleanly nest them inside the unified input box, and mapped the icon colors to the generic `trailing-icon` token variable, but further visual configurations currently fall back to Mantine defaults.

## 4. Section Text Color (non-svg content)

**Bug:** `leftSection`/`rightSection` content that isn't an `<svg>` (e.g. a plain `<span>$</span>` currency stand-in, as used in the story) rendered in Mantine's own gray (`--mantine-color-dimmed`, via `--input-section-color`) instead of the Recursica leading/trailing-icon token. Only the `.section :global(svg)` rule was token-colored; anything else fell through to Mantine's `Input.Section` default.
**Fix:** `.section` now sets `--input-section-color` — the exact variable Mantine's own `Input.Section` rule reads — to the Recursica leading-icon/trailing-icon token per position. This colors any section content (svg or plain text) with the real token instead of leaving a Mantine-library gray leaking through. The `:global(svg)` color rule is left in place (redundant but harmless).
**Note:** the on-screen color didn't change — Recursica's token already resolves near-black; this fixed the _source_ it comes from, not the value.
