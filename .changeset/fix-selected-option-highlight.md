---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Fix Dropdown/Autocomplete selected-option background highlight. mantine-adapter was keying off `data-combobox-selected` (Mantine's transient keyboard-nav highlight) instead of `data-combobox-active` (the real "matches current value" attribute), so the highlight only showed while arrow-key navigating. mui-adapter's Autocomplete had no selected-state rule at all; now keys off MUI's own `aria-selected`.
