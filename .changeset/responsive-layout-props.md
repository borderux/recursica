---
"@recursica/adapter-common": minor
"@recursica/mantine-adapter": minor
---

Support responsive (per-breakpoint) values on layout props for the `Flex` and `Grid` primitives in the Mantine adapter, matching what the underlying Mantine components can actually render.

- `Flex`: `direction`, `align`, `justify`, `wrap`, `gap`, `rowGap`, `columnGap` now accept either a single value or a per-breakpoint object, e.g. `direction={{ base: 'column', xl: 'row' }}` or `gap={{ base: 'rec-sm', xl: 'rec-xl' }}`.
- `Grid`: the `gap` (gutter) now accepts a per-breakpoint object (`Grid.Col` `span`/`offset`/`order` were already responsive).
- Margin props (`m`, `mt`, `mx`, …) accept responsive objects on every layout primitive, since they map to Mantine's Box style props.
- `rec-*` spacing tokens are resolved inside responsive objects too.

Adds a framework-agnostic `Responsive<T>` / `RecursicaBreakpoint` type to `@recursica/adapter-common`. It is structurally compatible with Mantine's `StyleProp`, so the responsive form no longer collapses to a bare scalar when the semantic prop type is intersected with Mantine's own props. Its breakpoint key is `RecursicaBreakpoint | (string & {})`, matching Mantine's own `StyleProp`, so custom breakpoint names added via Mantine's `MantineThemeSizesOverride` module augmentation are accepted as keys too. Responsive typing is deliberately per-component: Mantine's `Stack`/`Group` type `gap`/`align`/`justify`/`wrap` as single values, so those props remain single-valued there rather than advertising responsive support the component cannot render.
