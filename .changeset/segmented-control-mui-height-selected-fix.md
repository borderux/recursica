---
"@recursica/mui-adapter": minor
---

Fix `SegmentedControl` height (MUI's default `ToggleButton` box model was stacking on top of the token-driven label height) and selected-state styling (`Mui-selected` wasn't wrapped in `:global()`, so CSS Modules silently dropped the selector).
Also default to the first item selected when uncontrolled, matching mantine.
