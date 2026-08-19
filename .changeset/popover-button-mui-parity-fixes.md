---
"@recursica/mui-adapter": minor
---

Fix `Popover`: gap now matches Mantine (Mui's built-in per-placement tooltip margin was stacking on top of our offset), and the beak now has a visible border matching the dropdown body. Fix `Button`: line-height now applies via `labelText` per size (matching Mantine) instead of being dropped from the small-size token.
