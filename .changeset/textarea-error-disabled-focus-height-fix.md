---
"@recursica/mui-adapter": minor
"@recursica/mantine-adapter": minor
---

Fix `TextArea`: error state border now uses the recursica error color (was never triggering in either adapter). MUI disabled background/border, focus ring color, and default height now match Mantine instead of MUI's own defaults.
