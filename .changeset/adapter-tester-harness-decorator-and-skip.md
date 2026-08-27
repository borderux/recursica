---
"@recursica/adapter-tester": patch
---

Fix two real bugs found integrating this into `@recursica/beam-adapter`: the throwaway Mantine source-of-truth harness never applied the same `<Layer>` decorator real adapters' own `preview.tsx` files do by default, causing false-positive pixel diffs; and `runVisualRegression` burned the full per-test timeout on every story a target adapter doesn't implement yet instead of skipping fast. It now fetches the target's own `/index.json` and skips unmatched stories immediately.
