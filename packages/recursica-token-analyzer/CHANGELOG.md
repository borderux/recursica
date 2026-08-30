# @recursica/token-analyzer

## 1.7.3

### Patch Changes

- cb3796a: Fixed the unused-variable report silently dropping `--recursica_ui-kit_globals_*` entries from `unusedByComponent` even though they counted toward `summary.totalUnused`. They're now surfaced in a new `unusedGlobals` field.

## 1.7.2

### Patch Changes

- c31d5ae: Fixed the unused-variable report silently dropping `--recursica_ui-kit_globals_*` entries from `unusedByComponent` even though they counted toward `summary.totalUnused`. They're now surfaced in a new `unusedGlobals` field.

## 1.7.1

### Patch Changes

- 2e94fdf: Fixed repository url in packages.json for token-analyzer

## 1.7.0

### Minor Changes

- ab33870: Fixed publishing

## 1.6.0

### Minor Changes

- 786d870: Version bumped

## 1.5.0

### Minor Changes

- 9d06c41: Published publicly

## 1.4.0

### Minor Changes

- 56e0d63: Detect `recursica-ignore` directives pointing at CSS variables that no longer exist in the UI Kit dictionary (`staleExemptions` in the report). Add `--cleanup` to remove them automatically.

## 1.3.0

### Minor Changes

- c7051d2: Fixed official release and rev'd all package

## 1.2.0

### Minor Changes

- f4036cf: Updated official release and added Tree component

## 1.1.0

### Minor Changes

- 0ead0d7: Updated to latest version of JSON and CSS
- 0ead0d7: Updated with mui-adapter changes
