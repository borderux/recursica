---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Switch: attached `SwitchGroup` as the `Switch.Group` compound export (it existed standalone but was never attached), and tightened `RecursicaSwitchGroupProps` value types from `unknown[]` to `string[]`.
