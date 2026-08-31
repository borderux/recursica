---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Link now replaces the browser's native focus outline with the recursica focus ring (`--recursica_brand_states_focus_*`), matching Button/every other interactive component instead of falling back to the browser default. Fixes the same incorrect ring on Breadcrumb, since its items are typically Links.
