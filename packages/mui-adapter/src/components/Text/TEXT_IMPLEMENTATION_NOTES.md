# Text – Implementation Notes

## `StaticVariations` story gap didn't match mantine (2026-08-30, source-of-truth audit)

**Found:** `ui-kit-text--static-variations` used `gap: "24px"` in its own inline story wrapper,
while mantine's equivalent story used `gap: "16px"` — same component, same six variants, but
visibly more vertical space between each item in mui's render. Not a component bug: `Text.tsx`
itself has no opinion on inter-item spacing; the gap is entirely owned by each story's own
`<div style={{ display: "flex", flexDirection: "column", gap }}>` wrapper. Fixed by changing the
story's `gap` to `"16px"` to match mantine's.
