---
"@recursica/mui-adapter": patch
"@recursica/mantine-adapter": patch
---

CheckboxGroup/RadioGroup: no longer apply the per-item max-width token to the group's whole label+field row — was squeezing the group's own label in side-by-side layout. Group row now sizes naturally, matching SwitchGroup.
