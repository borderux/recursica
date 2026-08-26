---
"@recursica/storybook-template": patch
---

Include `stories` in the published package so `createMainConfig()`'s default token/theme demo stories resolve for consumers installing from npm, not just workspace consumers symlinked to source.
