---
"@recursica/mui-adapter": patch
---

Tabs (MUI): fixed missing `value` on `Tabs` (never read `TabContext`, so no tab was ever selected), the panel rendering beside instead of below the tab list, and dead `.Mui-selected`/`.panel` CSS selectors.
