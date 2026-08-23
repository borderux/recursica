# @recursica/common

## 1.2.1

### Patch Changes

- 8376651: Pin internal `@recursica/*` dependencies to real semver ranges instead of `*`. Published packages previously depended on internal packages (e.g. `@recursica/adapter-common`, `@recursica/official-release`, `@recursica/schemas`, `@recursica/recursica-postcss-vars`) with an unconstrained `*` version range, meaning a fresh install could pull in any future major version, including breaking changes. These now use `^<current-version>` ranges, which Changesets will keep in sync automatically via `updateInternalDependencies: "patch"` on future releases. No effect on local monorepo development — npm workspaces links sibling packages by name regardless of the declared range.

## 1.2.0

### Minor Changes

- 72174fc: Add MUI adapter, reworked storybook for adapter switching

### Patch Changes

- Updated dependencies [72174fc]
  - @recursica/schemas@1.2.0

## 1.1.1

### Patch Changes

- 3040b04: Added a function that formats a date string to show relative time with smart formatting

## 1.1.0

### Minor Changes

- f8a8129: Fix missing dist files

## 1.0.2

### Patch Changes

- 9aab210: update docs

## 1.0.1

### Patch Changes

- c6973c2: first publish
