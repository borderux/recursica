---
"@recursica/mantine-adapter": patch
"@recursica/mui-adapter": patch
"@recursica/common": patch
"@recursica/storybook-template": patch
---

Pin internal `@recursica/*` dependencies to real semver ranges instead of `*`. Published packages previously depended on internal packages (e.g. `@recursica/adapter-common`, `@recursica/official-release`, `@recursica/schemas`, `@recursica/recursica-postcss-vars`) with an unconstrained `*` version range, meaning a fresh install could pull in any future major version, including breaking changes. These now use `^<current-version>` ranges, which Changesets will keep in sync automatically via `updateInternalDependencies: "patch"` on future releases. No effect on local monorepo development — npm workspaces links sibling packages by name regardless of the declared range.
