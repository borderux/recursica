---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
"@recursica/storybook-template": patch
---

`RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).
