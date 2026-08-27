---
"@recursica/adapter-tester": minor
---

Interactive Dev Mode (the synced dual-Storybook comparison UI) is now config-driven and bundled into the CLI via `adapter-tester --serve`, instead of hardcoded to monorepo paths. Installing this package now wires up two npm scripts: `adapter-tester` (Dev Mode) and `adapter-tester:automated` (the headless Playwright suite, replacing `test:visual`).
