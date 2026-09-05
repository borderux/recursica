---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Simplified `src/index.ts`: it now just imports `@recursica/adapter-common/style.css` and re-exports `./components`, instead of manually re-exporting every component by name. `src/components/index.ts` re-exports `@recursica/adapter-common` directly (previously only `src/index.ts` did). No consumer-facing behavior change.
