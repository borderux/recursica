---
"@recursica/adapter-tester": patch
---

Source-of-truth harness/golden-fetch now installs `@recursica/adapter-mantine-v8` from its new standalone repo (golden at repo root) instead of the old in-monorepo `@recursica/mantine-adapter` (`packages/<name>`), following Mantine's extraction out of this monorepo.
