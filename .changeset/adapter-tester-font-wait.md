---
"@recursica/adapter-tester": patch
---

Golden-image capture now waits for pending stylesheets and web fonts to finish loading before screenshotting, instead of a flat 300ms delay. Fixes flaky/false-positive diffs whenever a brand's font family changes (a fresh network font fetch could previously lose the race against the fixed wait).
