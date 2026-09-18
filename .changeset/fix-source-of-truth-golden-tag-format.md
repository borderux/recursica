---
"@recursica/adapter-tester": patch
---

Fixed the source-of-truth golden-image fetch resolving the wrong GitHub tag for `@recursica/adapter-mantine-v8` releases. It assumed changesets tags every release as `<packageName>@<version>` (true for monorepo releases), but `recursica-adapter-mantine-v8` is a standalone single-package repo, which changesets/action tags as `v<version>` instead — so every release since the repo's extraction (aside from `1.0.2`, which had a one-off manual tag alias) 404'd against a tag that was never created, silently serving stale cached golden images on adapter-tester 5.1.2 and older instead of comparing against the real latest source of truth.
