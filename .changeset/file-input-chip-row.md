---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

`FileInput` now renders every selected file as a removable `Chip` in a horizontally scrollable row, in both single- and multiple-file mode (previously single-file mode showed plain filename text with no remove affordance). The trailing clear-all control is now a real shared `Button` (icon-only, "text" variant) instead of a bespoke `<span role="button">`.
