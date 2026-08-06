# @recursica/adapter-common

## 0.13.0

### Minor Changes

- dc583f5: Add the `Tree` component (mantine-adapter wraps `@mantine/core`'s `Tree`; mui-adapter wraps the new `@mui/x-tree-view` peer dependency). Adds shared `RecursicaTreeProps`/`RecursicaTreeNode` to adapter-common.

## 0.12.0

### Minor Changes

- 70ad4df: `RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).

## 0.11.0

### Minor Changes

- c49adb9: Added a Grid component (Grid, Grid.Col) to both the mantine-adapter and mui-adapter, sharing RecursicaGridProps/RecursicaGridColProps from adapter-common so both adapters expose the exact same prop API. mantine-adapter wraps Mantine's native Grid/Grid.Col directly; mui-adapter hand-composes the same API from MUI's single merged Grid component, since MUI has no separate container/item split.

## 0.10.0

### Minor Changes

- c7051d2: Fixed official release and rev'd all package

## 0.9.1

### Patch Changes

- f45006a: Fixed linting and typescript errors

## 0.9.0

### Minor Changes

- 8a1ecc5: Updated overStyled and fixed exports

## 0.8.0

### Minor Changes

- 2f237f7: Revised component props with integration issues

## 0.7.0

### Minor Changes

- 4031b12: Updated docs and finalized MCP

## 0.6.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

## 0.5.1

### Patch Changes

- 13b567a: Updated all documentation for better README and AGENT.md

## 0.5.0

### Minor Changes

- 7898170: Updated read-only states for all components

## 0.4.0

### Minor Changes

- a4cf78b: Updates storybook controls and added chip

## 0.3.0

### Minor Changes

- 9e31278: Added more mantine adapter components

## 0.2.0

### Minor Changes

- [#347](https://github.com/borderux/recursica/pull/347) [`eb5561b`](https://github.com/borderux/recursica/commit/eb5561bb27947938d60e5f4ce00b70e06a6264e5) Thanks [@mlmassey](https://github.com/mlmassey)! - Restructured and moved new adapter-common package
