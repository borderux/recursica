---
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Fix `Slider`'s `Disabled` story (was passing `disabled: false` in both adapters). In `mui-adapter`, also fix the disabled track showing red instead of grey, make the thumb focus ring keyboard-only (no glow on click/drag) to match Mantine, render assistive text as a `<span>`, and align mark label color/position with Mantine (which now applies its own mark label color token too).
