# Link Component Implementation Notes

## Focus State

There's no per-component `focus` token for Link in the design tokens. Like every other
interactive component (see Button), `.root:focus-visible` in `Link.module.css` replaces the
native browser focus outline with the global `--recursica_brand_states_focus_*` ring instead of
leaving it to the browser default. This was previously missing here — Link (and anything composing
it, e.g. Breadcrumb) fell back to the browser's native focus outline instead of Recursica's.
