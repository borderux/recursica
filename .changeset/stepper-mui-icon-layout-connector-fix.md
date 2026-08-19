---
"@recursica/mui-adapter": minor
---

Fix `Stepper`: use MUI's `alternativeLabel` so horizontal labels center under the icon and the connector centers on it, render the completed check mark as our own token-colored glyph instead of MUI's default blue `CheckCircle` SVG, and draw the vertical connecting line as a stretch-aware rail so it reaches the next step's circle regardless of description height.
