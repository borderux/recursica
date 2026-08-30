# @recursica/adapter-tester

## 5.0.2

### Patch Changes

- f8301b0: Normalize font smoothing during screenshot capture to reduce anti-aliasing noise in diffs.

## 5.0.1

### Patch Changes

- 9531598: Default automated runs to 1 Playwright worker (1 Chromium instance) instead of Playwright's CPU-based default, to avoid exhausting memory. Override with `--workers <n>`.

## 5.0.0

### Major Changes

- cb3796a: Split `diffThresholdPixels` into `goldenThresholdPixels` (own-drift check, default 10) and `sourceOfTruthThresholdPixels` (divergence check, default 3500) — cross-library divergence needs far more tolerance than same-library drift. Per-story `stories.<id>.threshold` is likewise split into `goldenThreshold`/`sourceOfTruthThreshold`. The divergence check is now threshold-based instead of requiring an exact pixel match. Breaking: rename these fields in any `adapter-tester.config.json`.

### Patch Changes

- cb3796a: Storybook ports are no longer pinned — the real port is auto-detected from each Storybook's own startup output instead of trusted from config, fixing flaky `webServer` timeouts when a configured port was already taken. Applies to both the automated run and interactive Dev Mode. `storybook.port`/`sourceOfTruth.port` in `adapter-tester.config.json` are now optional first-guess hints only.
- cb3796a: Fixed the HTML report grouping failures under a sourcemapped path into adapter-tester's own library code instead of the generated spec file, shortened test titles to just the story id, and attached expected/actual/diff images to failed golden checks. Golden checks now run across Playwright's parallel workers instead of forced to one, with per-story manifest.json writes locked so concurrent workers don't race each other. `--update-golden` now also prunes goldens (image + manifest entry) for stories no longer in Storybook.

## 4.0.0

### Major Changes

- cd83a0c: `storyThresholds`/`excludeStoryIds` config fields replaced with a single `stories` map keyed by story id prefix, each entry holding `{ threshold?, exclude? }`.

### Patch Changes

- c31d5ae: Fixed the HTML report grouping failures under a sourcemapped path into adapter-tester's own library code instead of the generated spec file, shortened test titles to just the story id, and attached expected/actual/diff images to failed golden checks. Golden checks now run across Playwright's parallel workers instead of forced to one, with per-story manifest.json writes locked so concurrent workers don't race each other. `--update-golden` now also prunes goldens (image + manifest entry) for stories no longer in Storybook.

## 3.0.0

### Major Changes

- e9f225d: `adapter-tester:automated` now diffs stories against committed golden images (`test/golden/`) instead of two live Storybooks, and flags cross-adapter divergence for review. New `--update-golden`/`--approve-divergence` flags and `isSourceOfTruthAdapter`/`excludeStoryIds`/`storyThresholds` config fields.

## 2.2.0

### Minor Changes

- f618b38: Breaking change from Title to Heading component

### Patch Changes

- 8f7288b: `adapter-tester:automated` now forwards extra args to `playwright test`, e.g. `npm run adapter-tester:automated -- --grep "Toast"` to scope a run.

## 2.1.0

### Minor Changes

- ae939ef: Latest adapters and tester

## 2.0.3

### Patch Changes

- 2b39ed1: Mantine source-of-truth harness now names `@recursica/mantine-adapter` and `@recursica/storybook-template` explicitly on the install command, forcing npm to re-check both against the registry every run instead of trusting a stale `package-lock.json` — a bare `npm install` was silently skipping the network check once the lockfile was already satisfied, so runs could keep testing against an old published adapter version.

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
