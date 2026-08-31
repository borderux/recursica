---
"@recursica/mui-adapter": patch
"@recursica/mantine-adapter": patch
---

mui-adapter: Dropdown now renders its `placeholder` prop and gains a matching `.placeholder` style; Autocomplete's open menu now has the same input-to-menu gap as mantine; TimePicker's leading icon is no longer offset too far right.
mantine-adapter: DatePicker's read-only value is now formatted via `valueFormat` instead of a raw `Date.toString()`; TimePicker's leading icon no longer overlaps the field text.
