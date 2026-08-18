---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Fix `FileInput`'s clear-all button: pressing Enter or Space while it was focused opened the native file picker instead of clearing the selection (a regression from switching the control to the shared `Button` component, which dropped the keydown handler the previous bespoke element had).
