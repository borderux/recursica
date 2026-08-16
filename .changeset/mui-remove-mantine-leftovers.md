---
"@recursica/mui-adapter": patch
---

Removed leftover literal Mantine references from mui-adapter CSS/types (dead `:global(.mantine-*)` selectors, unused classes wiring, a stray `@mantine/core` type augmentation) and swapped a hardcoded Mantine red for the real error-text token in Radio/Checkbox/Switch.
