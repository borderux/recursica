---
"@recursica/mui-adapter": minor
---

Implemented DatePicker (was a non-functional placeholder stub). Wraps MUI X's `DatePicker` with the same token mapping as the mantine-adapter's DatePicker: tokenized field border/background/text, a default token-styled calendar popover (hover, today, disabled/outside days, selected-day fill, header nav/month-label as Recursica text buttons), default `MM/DD/YY` format, and a default calendar icon that opens the picker (overridable via `slots.openPickerIcon`). `value`/`defaultValue`/`onChange` use plain `Date`, matching the mantine-adapter's convention.
