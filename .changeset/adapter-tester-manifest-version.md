---
"@recursica/adapter-tester": minor
---

The Mantine source-of-truth harness now copies the target's `recursica_manifest.json` and provides it to stories, so manifest-dependent stories like Pagination render. Dev Mode shows the Mantine adapter version in its pane title. `--port <n>` sets the Dev Mode port, and a port conflict now exits with an error. A target without a manifest only prints a warning. Dev Mode now has Live, Golden and Compute Diff tabs for the Mantine pane, showing the pixel diff against Mantine's golden with an editable per-story threshold saved back to the config.
