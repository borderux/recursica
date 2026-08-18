---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Fix `Button` showing the native browser focus outline instead of the recursica focus ring, and fix `Chip` losing its remove (X) icon behind an overflowing long label instead of truncating with an ellipsis. Adds optional `removeTabIndex`/`removeIconRef` props to `Chip` for building keyboard-navigable chip groups. Also fixes the remove icon's own focus ring rendering in the chip's neutral border color instead of the recursica focus-ring color, making it barely visible.
