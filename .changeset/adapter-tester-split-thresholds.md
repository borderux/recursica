---
"@recursica/adapter-tester": major
---

Split `diffThresholdPixels` into `goldenThresholdPixels` (own-drift check, default 10) and `sourceOfTruthThresholdPixels` (divergence check, default 3500) — cross-library divergence needs far more tolerance than same-library drift. Per-story `stories.<id>.threshold` is likewise split into `goldenThreshold`/`sourceOfTruthThreshold`. The divergence check is now threshold-based instead of requiring an exact pixel match. Breaking: rename these fields in any `adapter-tester.config.json`.
