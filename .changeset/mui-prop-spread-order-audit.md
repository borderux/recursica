---
"@recursica/mui-adapter": patch
---

Audited every component for the "spread after computed props" ordering bug (caller props silently overriding internal className/classes/icon/sx/onChange) and reordered spread-first in ~25 components. See COMPONENT_DEV_GUIDE.md §3.2 (adapter-common) for the rule.
