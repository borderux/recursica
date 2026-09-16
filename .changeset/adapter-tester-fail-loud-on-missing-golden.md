---
"@recursica/adapter-tester": patch
---

Fixed the source-of-truth divergence check silently passing every story when the source-of-truth golden baseline couldn't be resolved (unreachable registry, missing npm version, or no matching golden published for that release tag). It now throws and fails the whole run instead of degrading to a quiet no-op that Playwright reported as green.
