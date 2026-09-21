---
"@recursica/token-analyzer": patch
---

Fixed the used-variable filter only recognizing the old `_themes_` naming for auto-generated theme/layer backing variables, causing the Forge export's renamed `_modes_` segment to be flagged as ~1648 false-positive "unused" variables. The filter now excludes both `_themes_` and `_modes_` so future exports stay correct regardless of which naming a given release uses.
