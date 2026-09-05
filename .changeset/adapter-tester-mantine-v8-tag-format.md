---
"@recursica/adapter-tester": patch
---

Source-of-truth divergence check now always reads `test/golden/` from `@recursica/adapter-mantine-v8`'s `main` branch (cached by resolved commit) instead of resolving a published npm version and matching git tag — the standalone repo isn't guaranteed to tag every release, and tag format has changed before.
