# @recursica/adapter-tester

## 2.0.2

### Patch Changes

- 662c591: Dev Mode: current adapter now renders in the left pane (with Storybook's nav sidebar, driving the sync) and Mantine (source of truth) renders as the bare preview on the right.

## 2.0.1

### Patch Changes

- 1577d32: Fix two real bugs found integrating this into `@recursica/beam-adapter`: the throwaway Mantine source-of-truth harness never applied the same `<Layer>` decorator real adapters' own `preview.tsx` files do by default, causing false-positive pixel diffs; and `runVisualRegression` burned the full per-test timeout on every story a target adapter doesn't implement yet instead of skipping fast. It now fetches the target's own `/index.json` and skips unmatched stories immediately.

## 2.0.0

### Major Changes

- ba94657: Replaced the TS `playwright.config.ts`/`defineAdapterTesterConfig` integration with a single `adapter-tester` CLI reading `adapter-tester.config.json`. Default mode now diffs the current project's own Storybook against a published-Mantine harness with near-zero config; `sourceOfTruth.type: "url"` supports the prior monorepo-only comparison mode.

### Minor Changes

- ba94657: `adapter-tester.config.json` is now validated against a published JSON schema (`dist/adapter-tester.schema.json`) — unknown fields and wrong types fail fast with a specific error. Reference it via `"$schema"` for editor autocomplete.
- ba94657: Interactive Dev Mode (the synced dual-Storybook comparison UI) is now config-driven and bundled into the CLI via `adapter-tester --serve`, instead of hardcoded to monorepo paths. Installing this package now wires up two npm scripts: `adapter-tester` (Dev Mode) and `adapter-tester:automated` (the headless Playwright suite, replacing `test:visual`).

## 1.2.0

### Minor Changes

- 4e147ae: Publish as an installable package. Adds a library entry point (`defineAdapterTesterConfig`, `mantineSourceOfTruthWebServer`, `scaffoldMantineSourceOfTruthHarness`) and a `/testing` subpath (`runVisualRegression`) so any adapter repo can install `@recursica/adapter-tester` as a devDependency and diff its own Storybook against Mantine as the source of truth, without checking out this monorepo. Internal monorepo usage (Mantine vs MUI) is unchanged, now driven by `adapter-tester.config.ts`. Story discovery no longer requires a `ui-kit-` id prefix — it excludes `storybook-template`'s own `Theme/*`/`Tokens/*` demo stories and each adapter's `Introduction` stories instead, so adapters using other title conventions are picked up correctly.

## 1.1.0

### Minor Changes

- fe9d24a: Added adapter tester and updated adapters
