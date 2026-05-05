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
