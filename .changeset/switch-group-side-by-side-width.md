---
"@recursica/mui-adapter": patch
"@recursica/mantine-adapter": patch
---

SwitchGroup: fixed `side-by-side` layout always rendering as if stacked — the group was capped to the switch-item label's own 200px max-width, narrower than the mandatory 224px label column, guaranteeing a wrap.
