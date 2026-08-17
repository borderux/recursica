---
"@recursica/mantine-adapter": patch
---

AutoComplete (Mantine): fixed error state not turning the border red — the `wrapperProps` `data-error` hack (copied from `Input`-based components) targets Mantine's `Input.Wrapper` for `InputBase`-based components like `Autocomplete`, not the input's own root box, so it never reached the CSS. Now passes `error` as a boolean directly to Mantine's `Autocomplete`, which sets the border-triggering attribute natively without duplicating the assistive error text.
