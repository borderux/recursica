---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Added an `animate` prop to `Loader` (default `true`) — set `false` to freeze its CSS animation for a deterministic render, e.g. a visual-regression snapshot. The `Static*` Loader stories now use it, and the animated `Default`/`LayerTwoOval` stories are excluded from adapter-tester's visual regression.
