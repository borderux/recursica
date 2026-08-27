---
"@recursica/adapter-tester": major
---

Replaced the TS `playwright.config.ts`/`defineAdapterTesterConfig` integration with a single `adapter-tester` CLI reading `adapter-tester.config.json`. Default mode now diffs the current project's own Storybook against a published-Mantine harness with near-zero config; `sourceOfTruth.type: "url"` supports the prior monorepo-only comparison mode.
