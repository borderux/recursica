# @recursica/storybook-template

## 0.7.9

### Patch Changes

- Updated dependencies [c31d5ae]
- Updated dependencies [c31d5ae]
- Updated dependencies [c31d5ae]
  - @recursica/adapter-common@0.27.0

## 0.7.8

### Patch Changes

- Updated dependencies [f618b38]
  - @recursica/adapter-common@0.26.0

## 0.7.7

### Patch Changes

- 1c7d630: Include `stories` in the published package so `createMainConfig()`'s default token/theme demo stories resolve for consumers installing from npm, not just workspace consumers symlinked to source.

## 0.7.6

### Patch Changes

- Updated dependencies [2369301]
  - @recursica/adapter-common@0.25.0

## 0.7.5

### Patch Changes

- Updated dependencies [bc70636]
  - @recursica/adapter-common@0.24.0

## 0.7.4

### Patch Changes

- Updated dependencies [b7f76d8]
  - @recursica/adapter-common@0.23.0

## 0.7.3

### Patch Changes

- Updated dependencies [e4759d1]
  - @recursica/adapter-common@0.22.0

## 0.7.2

### Patch Changes

- Updated dependencies [0bb2dab]
- Updated dependencies [0bb2dab]
  - @recursica/adapter-common@0.21.0

## 0.7.1

### Patch Changes

- 8376651: Pin internal `@recursica/*` dependencies to real semver ranges instead of `*`. Published packages previously depended on internal packages (e.g. `@recursica/adapter-common`, `@recursica/official-release`, `@recursica/schemas`, `@recursica/recursica-postcss-vars`) with an unconstrained `*` version range, meaning a fresh install could pull in any future major version, including breaking changes. These now use `^<current-version>` ranges, which Changesets will keep in sync automatically via `updateInternalDependencies: "patch"` on future releases. No effect on local monorepo development — npm workspaces links sibling packages by name regardless of the declared range.
- Updated dependencies [40832c5]
  - @recursica/adapter-common@0.20.0

## 0.7.0

### Minor Changes

- 6e99afc: Versioned all for refresh
- 560874f: Updated to latest JSON and updated adaper

### Patch Changes

- 560874f: Added Layer story
- Updated dependencies [dc583f5]
  - @recursica/adapter-common@0.13.0

## 0.6.1

### Patch Changes

- 70ad4df: `RecursicaThemeProvider` now automatically wraps its children in a base `<Layer layer={0}>` by default (new `initLayer0` prop, defaults to `true`), so page-level surface/border/elevation CSS variables resolve out of the box instead of requiring an undocumented manual `<Layer layer={0}>` wrapper. Opt out with `initLayer0={false}` to place the base layer yourself. Also documented `Layer` and `RecursicaThemeProvider` (previously referenced by nearly every other component's USAGE.md but undocumented themselves) with dedicated USAGE.md pages and llms.txt entries in both adapters, and updated the shared Storybook theme decorator to opt out of the new default (each adapter's preview already places its own configurable per-story Layer).
- Updated dependencies [70ad4df]
  - @recursica/adapter-common@0.12.0

## 0.6.0

### Minor Changes

- 3756d7b: Cleaned up stories and added layout stories to mui-adapter

## 0.5.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

### Patch Changes

- Updated dependencies [72174fc]
  - @recursica/recursica-postcss-vars@1.4.0
  - @recursica/adapter-common@0.6.0

## 0.4.1

### Patch Changes

- 13b567a: Updated all documentation for better README and AGENT.md
- Updated dependencies [13b567a]
  - @recursica/recursica-postcss-vars@1.3.1
  - @recursica/adapter-common@0.5.1

## 0.4.0

### Minor Changes

- 9e31278: Added more mantine adapter components

### Patch Changes

- Updated dependencies [9e31278]
  - @recursica/recursica-postcss-vars@1.3.0
  - @recursica/adapter-common@0.3.0

## 0.3.0

### Minor Changes

- a1067c9: Implemented stories in construction and over styling

## 0.2.1

### Patch Changes

- 5f73853: Fixed incorrect plugin and basepath

## 0.2.0

### Minor Changes

- [#347](https://github.com/borderux/recursica/pull/347) [`eb5561b`](https://github.com/borderux/recursica/commit/eb5561bb27947938d60e5f4ce00b70e06a6264e5) Thanks [@mlmassey](https://github.com/mlmassey)! - Restructured and moved new adapter-common package

- [#349](https://github.com/borderux/recursica/pull/349) [`6df88b7`](https://github.com/borderux/recursica/commit/6df88b78ca572dc7905974300116107415a7640a) Thanks [@mlmassey](https://github.com/mlmassey)! - Updated storybook layout and consolidated storybook release

### Patch Changes

- Updated dependencies [[`eb5561b`](https://github.com/borderux/recursica/commit/eb5561bb27947938d60e5f4ce00b70e06a6264e5), [`eb5561b`](https://github.com/borderux/recursica/commit/eb5561bb27947938d60e5f4ce00b70e06a6264e5)]:
  - @recursica/recursica-postcss-vars@1.2.0
  - @recursica/adapter-common@0.2.0
