---
"@recursica/mui-adapter": patch
---

Chip (MUI): fixed three visual bugs vs `mantine-adapter` — extra right padding on short-text chips (duplicate `min-width`/`max-width` applied on both `.root` and `.label`, now only on `.root`), delete/leading icon color and spacing leaking MUI's own default styles (fixed via CSS specificity match on `.leadingIcon`/`.removeIconWrapper`), and a missing icon-text gap on the leading icon (accidental blanket `margin: 0` collapsed it — restored `margin-right` for the gap, matching the selected-state check icon).
