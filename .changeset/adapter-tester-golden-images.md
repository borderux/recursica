---
"@recursica/adapter-tester": major
---

`adapter-tester:automated` now diffs stories against committed golden images (`test/golden/`) instead of two live Storybooks, and flags cross-adapter divergence for review. New `--update-golden`/`--approve-divergence` flags and `isSourceOfTruthAdapter`/`excludeStoryIds`/`storyThresholds` config fields.
