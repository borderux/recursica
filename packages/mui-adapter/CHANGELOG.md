# @recursica/mui-adapter

## 0.20.0

### Minor Changes

- a4a45ff: Implement `TimePicker` (previously a stub) in both adapters, using `@mantine/dates`'s own `TimePicker` and `@mui/x-date-pickers`'s `TimePicker` respectively. Defaults to 12-hour format with a dedicated AM/PM selector (Recursica-specific); pass the new `hideAmPm` prop for a plain 24-hour input.

### Patch Changes

- Updated dependencies [a4a45ff]
  - @recursica/adapter-common@0.13.1

## 0.19.1

### Patch Changes

- 5c10166: Split shared contributor docs (`COMPONENT_DEV_GUIDE.md`, `COMPONENT_STORYBOOK_GUIDE.md`) into a canonical version in `adapter-common` plus thin per-adapter deltas, and publish `docs/PHILOSOPHY.md` to npm.

## 0.19.0

### Minor Changes

- 6e99afc: Versioned all for refresh
- dc583f5: Add the `Tree` component (mantine-adapter wraps `@mantine/core`'s `Tree`; mui-adapter wraps the new `@mui/x-tree-view` peer dependency). Adds shared `RecursicaTreeProps`/`RecursicaTreeNode` to adapter-common.

### Patch Changes

- c8b21dd: Fix broken/renamed CSS token references and wire up previously-unused tokens across ~30 components, using `@recursica/mantine-adapter` as the reference.
- Updated dependencies [560874f]
- Updated dependencies [6e99afc]
- Updated dependencies [560874f]
- Updated dependencies [dc583f5]
  - @recursica/official-release@2.7.0
  - @recursica/adapter-common@0.13.0

## 0.18.1

### Patch Changes

- 70ad4df: `RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).
- Updated dependencies [70ad4df]
  - @recursica/adapter-common@0.12.0

## 0.18.0

### Minor Changes

- c49adb9: Added a Grid component (Grid, Grid.Col) to both the mantine-adapter and mui-adapter, sharing RecursicaGridProps/RecursicaGridColProps from adapter-common so both adapters expose the exact same prop API. mantine-adapter wraps Mantine's native Grid/Grid.Col directly; mui-adapter hand-composes the same API from MUI's single merged Grid component, since MUI has no separate container/item split.

### Patch Changes

- Updated dependencies [c49adb9]
  - @recursica/adapter-common@0.11.0

## 0.17.0

### Minor Changes

- f52662b: Updated docs and layout. Added Table

## 0.16.0

### Minor Changes

- db7701f: Updated layout of docs and mcp

## 0.15.0

### Minor Changes

- e0f2fc5: Update to latest official version

### Patch Changes

- Updated dependencies [e0f2fc5]
  - @recursica/official-release@2.6.0

## 0.14.0

### Minor Changes

- 584208e: Updated official release

## 0.13.0

### Minor Changes

- c7051d2: Fixed official release and rev'd all package

### Patch Changes

- Updated dependencies [c7051d2]
  - @recursica/adapter-common@0.10.0
  - @recursica/official-release@2.3.0

## 0.12.0

### Minor Changes

- f4036cf: Updated official release and added Tree component

### Patch Changes

- f45006a: Fixed linting and typescript errors
- Updated dependencies [f4036cf]
- Updated dependencies [f4036cf]
- Updated dependencies [f45006a]
  - @recursica/official-release@2.2.0
  - @recursica/adapter-common@0.9.1

## 0.11.0

### Minor Changes

- 8a1ecc5: Updated overStyled and fixed exports

### Patch Changes

- Updated dependencies [8a1ecc5]
  - @recursica/adapter-common@0.9.0

## 0.10.0

### Minor Changes

- 2f237f7: Revised component props with integration issues

### Patch Changes

- Updated dependencies [2f237f7]
  - @recursica/adapter-common@0.8.0

## 0.9.1

### Patch Changes

- 8151cb1: Fixed export of adapter-common from adapters

## 0.9.0

### Minor Changes

- ccf7d19: Updated to cause a new version release

### Patch Changes

- Updated dependencies [ccf7d19]
  - @recursica/official-release@0.3.0

## 0.8.0

### Minor Changes

- 4329756: Added official release and update mcp

### Patch Changes

- 8897f92: Updated agent instructions for MCP
- 4329756: Initialize `@recursica/official-release` package to version and distribute design tokens, configure automatic postinstall copying logic, and integrate fallback setup checks.
- Updated dependencies [4329756]
- Updated dependencies [4329756]
  - @recursica/official-release@0.2.0

## 0.7.0

### Minor Changes

- 4031b12: Updated docs and finalized MCP

## 0.6.0

### Minor Changes

- a407c6f: More complete mui components
- 93df8e2: Added form components
- fe9d24a: Added adapter tester and updated adapters
- 93df8e2: Added form controls

## 0.5.0

### Minor Changes

- 0ead0d7: Updated with mui-adapter changes

## 0.4.0

### Minor Changes

- cdd7b9d: Added Loader and Button and uploaded Button loading state

## 0.3.0

### Minor Changes

- 3756d7b: Cleaned up stories and added layout stories to mui-adapter

## 0.2.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

### Patch Changes

- 72174fc: Updated docs and README.md links

## 0.2.0

### Minor Changes

- 0f7ca8b: Scaffolding and Box component

## 0.0.1

### Patch Changes

- c6973c2: first publish
