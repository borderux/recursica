# Modal Implementation Notes

## `.title` descender clipping (Matt Massey, 2026-08-28)

`.title` truncates with an ellipsis (`white-space: nowrap; text-overflow: ellipsis`) rather than
wrapping, needing `flex: 1 1 auto; min-width: 0;` since it's a flex child of `.header` alongside
the close button. It used plain `overflow: hidden` to make the ellipsis work, which also clips
descenders (e.g. the "g" in a long title) whenever `text_line-height` is tighter than the font's
natural ascent+descent. Switched to `overflow: clip; overflow-clip-margin: 0.35em;` — same
truncation, but ink can bleed slightly past the line box before it's actually clipped.
Project-wide fix; see Chip's `CHIP_IMPLEMENTATION_NOTES.md` for the original discovery. Matches
mantine-adapter's equivalent `.title` rule (see its own `MODAL_IMPLEMENTATION_NOTES.md`).

## Vertical anchor position (source-of-truth audit, 2026-08-30)

**Decision:** Anchor the modal near the top of the viewport instead of MUI's own default
vertical centering, matching mantine's `Modal`, which has no `centered` override and so uses
its own library default (near-top, via `.mantine-Modal-inner`'s `align-items: flex-start` +
`padding: 30px 40px` — unstyled by any Recursica token).

**Implementation:** MUI's `Dialog` centers its paper both axes by default via
`.MuiDialog-container`. `.root :global(.MuiDialog-container)` overrides that to
`align-items: flex-start; padding: 30px 40px;`, matching mantine's numbers exactly since
neither side is token-driven — this is purely "reproduce the source of truth's own default
library shape" (see Grid's `IMPLEMENTATION_NOTES.md` for the same rule applied to Grid).
`.inner` (the paper) also gets `margin: 0` — MUI's paper ships its own default 32px margin on
top of the container padding, which would double the offset otherwise.

Residual: still a small width/horizontal-offset gap against mantine's golden after this fix
(diffPixels dropped from ~172k to ~25k, still over the 2500 threshold) — not yet root-caused,
see `OPEN_QUESTIONS.txt`.
