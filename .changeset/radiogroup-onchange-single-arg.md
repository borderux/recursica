---
"@recursica/adapter-common": patch
"@recursica/mui-adapter": patch
---

Fixed RadioGroup selection not updating in mui-adapter — its onChange was typed and wired as MUI's native `(event, value)`, but Mantine's RadioGroup (the cross-adapter source of truth) only ever calls back with `(value)`. Normalized the shared contract and mui-adapter's wiring to single-argument.
