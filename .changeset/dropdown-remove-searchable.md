---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Removed `searchable` from `Dropdown`'s shared contract — not a supported feature (that's `AutoComplete`'s job). mantine-adapter now strips it at runtime like its other unsupported native props; mui-adapter never wired it up.
