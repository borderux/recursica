---
"@recursica/mantine-adapter": patch
---

Fix `FormControlWrapper`: label now uses `htmlFor` instead of `id`, and the field's `id` is cloned onto the child, so `label.control` resolves and clicking the label focuses the field.
