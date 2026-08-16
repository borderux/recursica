---
"@recursica/mui-adapter": patch
---

Radio/Checkbox/Switch description and error text now render through the shared `AssistiveElement` component instead of locally styled divs, removing the last hardcoded hex values (Mantine's default dimmed gray) from mui-adapter CSS.
