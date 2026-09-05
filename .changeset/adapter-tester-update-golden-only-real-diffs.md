---
"@recursica/adapter-tester": patch
---

`--update-golden` no longer blindly overwrites every story's golden PNG. It now only writes a story that's missing a golden or whose live render has actually drifted past `goldenThresholdPixels` (same comparison `adapter-tester:automated` already uses) — an unscoped full-suite run no longer dirties hundreds of unchanged images. Also stops `--approve-divergence` from incidentally rewriting the own-drift golden, since that mode only approves a source-of-truth divergence.
