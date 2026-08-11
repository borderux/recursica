---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
---

Bundle `@recursica/adapter-common`'s types into each adapter's published `.d.ts` (via `vite-plugin-dts`'s `rollupTypes` + `bundledPackages`). Previously the generated declaration files re-exported and referenced `@recursica/adapter-common` by bare package specifier, which meant consumers' TypeScript needed `@recursica/adapter-common` resolvable even though the runtime JS and CSS were already fully self-contained. No public API changes — type names and shapes are unchanged, they're just inlined now instead of imported from the dependency.
