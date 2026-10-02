---
"@recursica/adapter-common": minor
---

`RecursicaThemeProvider` no longer takes `breakpoints` or warns about breakpoint names (`findMissingBreakpoints` and `getForgeBreakpointNames` are removed), and its `manifest` prop now feeds a new `useRecursicaManifest()` hook for components that need it.
