---
"@recursica/token-analyzer": patch
---

Fixed the unused-variable report silently dropping `--recursica_ui-kit_globals_*` entries from `unusedByComponent` even though they counted toward `summary.totalUnused`. They're now surfaced in a new `unusedGlobals` field.
