# Tabs Implementation Notes

## `inverted` never actually moved the tab list below the content (2026-08-30, source-of-truth audit)

**Reported symptom:** in the `Inverted` story, content should render above the tab list (tabs
below), with padding between them — the padding looked missing "when content is on top".

**What was actually happening:** `inverted` is a real, native `@mantine/core` `Tabs` prop
(confirmed by reading `@mantine/core`'s own `Tabs.cjs`/`Tabs.css`) — this adapter doesn't even
reference it directly, it flows straight through `...rest` to `<MantineTabs>`. But Mantine's own
`inverted` support only flips the active-indicator line and border-radius direction (top vs
bottom) via `data-inverted` CSS selectors; it does not reposition `.list` below `.panel`. The
story always renders `<Tabs.List>` before the `<Tabs.Panel>`s in JSX regardless of `inverted`, so
"padding missing when content is on top" wasn't reproducible as such: content was never on top to
begin with, before this fix.

**Fix:** Mantine renders `Tabs.List`/`Tabs.Panel` as flat siblings directly under `.root` despite
the nested JSX (confirmed via live DOM dump) — so making `.root[data-orientation="horizontal"]`
a flex column and giving `.list` `order: 1` only when `[data-inverted]` reorders them visually
with zero DOM changes, no compound-component internals to touch. Scoped to horizontal only —
vertical's "instead of left" flip isn't exercised by any story. Also introduced a shared
`--tabs-content-gap` custom property per variant (previously each variant inlined its own long
token reference directly into `.list`'s `margin-bottom`) so the same gap can be redirected:
`margin-bottom: 0; margin-top: var(--tabs-content-gap);` when inverted, since the gap now needs
to land above the now-trailing tab list instead of below it. Verified live against mui-adapter's
identical fix (see its own `Tabs/IMPLEMENTATION_NOTES.md`) — pixel-equivalent stacking order and
gap; no regression on Default/Outline/Pills/Vertical stories.
