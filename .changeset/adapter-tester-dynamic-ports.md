---
"@recursica/adapter-tester": patch
---

Storybook ports are no longer pinned — the real port is auto-detected from each Storybook's own startup output instead of trusted from config, fixing flaky `webServer` timeouts when a configured port was already taken. Applies to both the automated run and interactive Dev Mode. `storybook.port`/`sourceOfTruth.port` in `adapter-tester.config.json` are now optional first-guess hints only.
