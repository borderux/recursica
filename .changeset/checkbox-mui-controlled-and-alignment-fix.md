---
"@recursica/mui-adapter": patch
---

Checkbox (MUI): fixed the checkmark never appearing on click — `checked` was always
forced onto MUI's native input even for plain uncontrolled usage (no `checked`/only
`defaultChecked`), pinning it to a value that never updates after the initial render.
Now only forced when grouped (CheckboxGroup owns state) or the caller explicitly passes
`checked`, matching the existing `Switch` pattern. Also fixed the label rendering
vertically offset from the checkbox (`.labelWrapper` needed `display: flex` to blockify
the native inline `<label>`, mirroring Mantine's own wrapper) and the checkmark icon
rendering off-center inside the box in both standalone Checkbox and CheckboxGroup
(`.input` now centers its icon child directly).
