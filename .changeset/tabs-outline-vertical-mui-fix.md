---
"@recursica/mui-adapter": minor
---

Fix `Tabs`: `outline` variant's selected tab now shows a connected border box (matching Mantine) with no stray bottom border line. `default` variant no longer shifts sibling tabs when selecting one (a stray ripple element was being pulled into flex layout). `vertical` orientation no longer stretches the tablist to the full row width, and its divider now runs the full height with the selection indicator aligned on it instead of offset to the side.
