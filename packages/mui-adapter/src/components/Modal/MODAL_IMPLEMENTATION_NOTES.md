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
