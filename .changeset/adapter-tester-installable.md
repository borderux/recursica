---
"@recursica/adapter-tester": minor
---

Publish as an installable package. Adds a library entry point (`defineAdapterTesterConfig`, `mantineSourceOfTruthWebServer`, `scaffoldMantineSourceOfTruthHarness`) and a `/testing` subpath (`runVisualRegression`) so any adapter repo can install `@recursica/adapter-tester` as a devDependency and diff its own Storybook against Mantine as the source of truth, without checking out this monorepo. Internal monorepo usage (Mantine vs MUI) is unchanged, now driven by `adapter-tester.config.ts`. Story discovery no longer requires a `ui-kit-` id prefix — it excludes `storybook-template`'s own `Theme/*`/`Tokens/*` demo stories and each adapter's `Introduction` stories instead, so adapters using other title conventions are picked up correctly.
