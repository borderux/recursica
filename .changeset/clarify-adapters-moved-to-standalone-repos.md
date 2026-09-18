---
"@recursica/recursica": patch
"@recursica/adapter-common": patch
---

Updated docs (`README.md`, `AGENT.md`, `docs/DOCUMENTATION_STRATEGY.md`, `packages/adapter-common/docs/PIPELINE.md`, `packages/adapter-common/CONTRIBUTING.md`) to reflect that the Mantine and MUI adapters are no longer packages in this monorepo — they're separate repos (`recursica-adapter-mantine-v8`, `recursica-adapter-mui-v7`), with `recursica-adapter-mantine-v8` as the source of truth. Fixed stale `packages/mantine-adapter`/`packages/mui-adapter`/`apps/recursica-storybook` references left over from before that move.
