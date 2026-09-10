---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Exposed the previously-orphaned `RecursicaEmptyValueRendererProps` type from `adapter-common` and re-exported it from `mantine-adapter`/`mui-adapter`. Also fixed a pre-existing unused-import lint failure and a `Chip` story type error in their Storybook files.
