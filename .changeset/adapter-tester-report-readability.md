---
"@recursica/adapter-tester": patch
---

Fixed the HTML report grouping failures under a sourcemapped path into adapter-tester's own library code instead of the generated spec file, shortened test titles to just the story id, and attached expected/actual/diff images to failed golden checks. Golden checks now run across Playwright's parallel workers instead of forced to one, with per-story manifest.json writes locked so concurrent workers don't race each other. `--update-golden` now also prunes goldens (image + manifest entry) for stories no longer in Storybook.
