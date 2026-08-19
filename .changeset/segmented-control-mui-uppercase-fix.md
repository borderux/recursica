---
"@recursica/mui-adapter": minor
---

Fix `SegmentedControl` labels rendering all-caps in MUI (its `ToggleButton` uppercase default was leaking through an invalid text-transform token). Labels now match Mantine's original casing.
