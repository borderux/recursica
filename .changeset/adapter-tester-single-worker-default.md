---
"@recursica/adapter-tester": patch
---

Default automated runs to 1 Playwright worker (1 Chromium instance) instead of Playwright's CPU-based default, to avoid exhausting memory. Override with `--workers <n>`.
