---
"@recursica/adapter-tester": patch
---

`adapter-tester:automated` now forwards extra args to `playwright test`, e.g. `npm run adapter-tester:automated -- --grep "Toast"` to scope a run.
