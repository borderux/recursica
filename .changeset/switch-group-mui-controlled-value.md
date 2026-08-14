---
"@recursica/mui-adapter": patch
---

Switch (MUI): `SwitchGroup` now actually controls its children via a `SwitchGroupContext` (same pattern as `Checkbox`/`CheckboxGroup`) — previously `value`/`defaultValue`/`onChange` were destructured and discarded, so grouped switches never checked or updated.
