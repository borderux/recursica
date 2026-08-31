---
"@recursica/adapter-common": patch
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Breadcrumb now marks its last child `aria-current="page"` and, if it looks interactive (has `href`/`onClick`), strips both and drops it from the tab order — best-effort, not a guarantee for custom Link components with their own internal navigation. Backed by a CSS reset (no color/underline/pointer-events) and the current item now picks up Link's font-family. New shared `markCurrentPageItem` util in adapter-common. mui-adapter's story also gets parity with mantine-adapter's: the last crumb renders as plain text, not a `Link`.
