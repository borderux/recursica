# TextArea – implementation notes

Decisions and design tweaks specific to the UI Kit's TextArea wrapped against `@mui/material`.

---

## 1. Neutralizing `min-height` on TextareaAutosize's hidden measurement clone (source-of-truth audit, 2026-08-30)

**Symptom:** `ui-kit-textarea--autosize` (MUI) rendered much taller than Mantine's equivalent —
~208px vs. Mantine's ~93px for the same `minRows={2}`/`maxRows={6}` content.

**Root cause:** MUI's `TextField` always renders `multiline` fields through
`@mui/material/TextareaAutosize`, which mounts **two** `<textarea>` elements: the real, visible
one, and a second `aria-hidden="true"` clone (`visibility: hidden; position: absolute; height: 0`)
used purely to measure natural `scrollHeight` for the auto-grow calculation
(`TextareaAutosize.js` → `calculateTextareaStyles`). Both clones receive the exact same
`className`, including this component's own CSS-module `.input` class.

`.input`'s `min-height: calc(rows * line-height + 2*padding + 2px)` rule — meant only as a
cosmetic floor for the _visible_ textarea — was therefore also forcing the hidden clone's
`scrollHeight` up to that same floor, regardless of its actual (near-zero) content. Since
TextareaAutosize's algorithm computes `singleRowHeight` from that clone and then multiplies it by
`minRows`, the corrupted single-row measurement (~93px instead of the true ~17px line height)
cascaded into a final `minRows * singleRowHeight` output roughly double what it should have been
— confirmed via `getComputedStyle` on both clones: the hidden one's `scrollHeight` matched the
CSS floor almost exactly instead of the actual near-empty content height.

**Implementation:** Added `.input[aria-hidden="true"] { min-height: 0; }`. This selector only
ever matches TextareaAutosize's own hidden measurement clone (the real textarea has no
`aria-hidden` attribute), so it restores accurate content-based measurement there without
touching the visible textarea at all — which still gets the `min-height` floor applied directly,
producing the same ~93px baseline Mantine renders for short/empty content.

## 2. Fixed (non-autosize) height still pinned via `!important` on `.input`

Unchanged from the existing implementation: `.root:not([data-autosize]) .input { height: ... !important }`
still overrides TextareaAutosize's own inline `height` for every story that doesn't set
`autosize`, since MUI always routes `multiline` through TextareaAutosize regardless of Recursica's
`autosize` prop — there is no way to opt a MUI `TextField` out of it once `multiline` is set. This
rule is unaffected by the `[aria-hidden="true"]` fix above, since it targets the visible node via
`.root:not([data-autosize]) .input` and the `[aria-hidden="true"]` rule only lowers specificity
competition for `min-height`, not `height`.
