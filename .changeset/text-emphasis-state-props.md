---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
"@recursica/mui-adapter": minor
---

Add `emphasis` (opacity, defaults to `high`) and `state` (semantic `success`/`alert`/`warning` color) props to `Text` and `Heading`. The two are independent: `emphasis` sets opacity and is safe on any layer, `state` sets color and otherwise inherits the layer color.
