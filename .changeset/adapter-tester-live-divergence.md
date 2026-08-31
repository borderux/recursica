---
"@recursica/adapter-tester": minor
---

Source-of-truth divergence check (`--divergence-only`) now diffs this run's live Storybook render directly against the source-of-truth adapter's stored golden, instead of this project's own stored golden — no `--update-golden` step needed to see a fresh result. Added `--story <story-id>` to scope any run to exactly one story.
