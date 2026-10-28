---
"@recursica/adapter-common": minor
"@recursica/storybook-template": patch
---

`RecursicaThemeProvider`'s `initLayer0` now sets `data-recursica-layer="0"` on `<body>` and styles it directly instead of wrapping children in an extra `Layer` div. Layer 0 no longer applies border or elevation.
