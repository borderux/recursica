---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Fix `TransferList` checkboxes not toggling/showing checked state in either adapter (grouping-for-layout was silently overriding item selection). Add `readOnly` support and a `ReadOnly` story.
