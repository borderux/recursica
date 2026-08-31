# Accordion – implementation notes

Decisions and design tweaks specific to the UI Kit's Accordion wrapped against `@mui/material`.

---

## 1. Context-based container (no native MUI equivalent)

**Decision:** MUI has no group-level `Accordion` — its own `Accordion` component _is_ the
item, controlled individually via `expanded`/`onChange`. Recursica's container/group model
(single `value`, `multiple`, cascading `chevron`) is reimplemented with a React context
(`AccordionContext`) that each `AccordionItem`/`AccordionControl` reads from.
**Implementation:** `AccordionBase` owns the controlled/uncontrolled `value` state and hands
`{ value, onChange, chevron }` down via context; `AccordionItem` derives its own `expanded`
from that context instead of taking it as a prop.

---

## 2. Prop-contract Omits protect the context wiring

**Decision:** Because `AccordionItem`/`AccordionControl` are thin wrappers around real MUI
components (`MuiAccordion`/`MuiAccordionSummary`), their native `expanded`/`onChange`/
`expandIcon` props would otherwise collide with the values these wrappers compute from
context.
**Implementation:** `AccordionItemWrapperProps` omits `expanded`/`onChange`/`defaultExpanded`
from `MuiAccordionProps`; `AccordionControlWrapperProps` omits `expandIcon` from
`MuiAccordionSummaryProps`. Neither is exposed on `RecursicaAccordionItemProps`/
`RecursicaAccordionControlProps`, so passing them is a compile error, not a silent override.

---

## 3. `disabled` is a formally supported, shared prop

**Decision:** `RecursicaAccordionItemProps.disabled` is shared as-is with MUI's native
`Accordion.disabled` — same name, same shape, no reshaping needed. MUI already blocks
click/keyboard interaction on the control internally once `disabled` is set (its `AccordionSummary`
renders as a real disabled `<button>`); the visual dim is Recursica's own, not MUI's default.
**Implementation:** `AccordionItem` destructures `disabled` explicitly (rather than letting it
ride through in `...rest`) so it can also drive `data-disabled` on the item root for the dim.
MUI's own default disabled treatment — a separate hardcoded background/opacity on both the
item root and the control (`.Mui-disabled`) — is neutralized in `Accordion.module.css` so the
token-driven `.item[data-disabled]` dim is the single source of truth.

---

## 4. Chevron via `expandIcon` wrapper

**Decision:** MUI's expand indicator is set through `AccordionSummary.expandIcon`, not a
child. Recursica's container-level `chevron` (or the default arrow) is threaded through
context and rendered into that slot.
**Implementation:** `AccordionControl` resolves `ctx?.chevron ?? <ChevronIcon />` and passes
it as `expandIcon={<span className={styles.chevron}>{resolvedChevron}</span>}`.

---

## 5. Transparent background for `Layer` overrides

**Decision:** Same reasoning as the Mantine adapter's hover-fix note — MUI's `Paper`-derived
`Accordion` root ships its own background; Recursica needs it transparent so ambient `Layer`
tokens can apply.
**Implementation:** `AccordionItem` merges `backgroundColor: "transparent"` into `style`
ahead of any caller-supplied `style`, and forces `disableGutters`/`elevation={0}`/`square` to
strip MUI's own spacing/elevation/border-radius defaults.

---

## 6. Chevron double-rotation (source-of-truth audit, 2026-08-30)

**Decision:** Don't rotate `.chevron` ourselves on expand — let MUI's own wrapper handle it.

**Implementation:** `expandIcon`'s `<span className={styles.chevron}>` gets placed _inside_
MUI's own `.MuiAccordionSummary-expandIconWrapper`, which already rotates 180deg on
`.Mui-expanded` (MUI's own stable, documented behavior). `Accordion.module.css` also had
`.item:global(.Mui-expanded) .chevron { transform: rotate(180deg); }`, rotating the same span
a _second_ time — the two 180deg rotations canceled out, so the chevron visually never
appeared to move even though the accordion state was correct. Found via the
`adapter-tester:source-of-truth` divergence check comparing against mantine's golden. Removed
the redundant `transform` from that rule; kept the icon-color swap it also carries.

---

## 7. Long title wrapped instead of truncating (source-of-truth audit, 2026-08-30)

**Symptom:** `ui-kit-accordion--long-title-truncation`'s header label wrapped onto multiple
lines (pushing the chevron down) instead of truncating to a single line with an ellipsis, like
mantine's does.

**Root cause:** Two missing pieces, both present in mantine's identically-purposed `.label`
rule but absent from mui's:

1. `.label` itself had no `white-space: nowrap`/`text-overflow: ellipsis`/`overflow` at all —
   it was never told to truncate in the first place.
2. Even after adding those, truncation still didn't take effect: `.control
:global(.MuiAccordionSummary-content)` — the MUI-native flex wrapper sitting between
   `.control`'s flex row and `.label` — had `flex: 1` but no `min-width: 0`. A flex item's
   automatic minimum width defaults to its content's min-content size; once `.label`'s text is
   `white-space: nowrap`, that min-content size becomes the entire unwrapped title width, which
   propagated up through this intermediate flex item and prevented it (and `.label` inside it)
   from ever shrinking below the full title width, so `text-overflow: ellipsis` had no room to
   apply.

**Fix:** Added `min-width: 0`, `overflow: clip` (+ `overflow-clip-margin: 0.35em`, not plain
`hidden`, to avoid clipping descenders — see Chip/FileInput's implementation notes for the
original discovery), `white-space: nowrap`, and `text-overflow: ellipsis` to `.label` (matching
mantine's rule exactly), plus `min-width: 0` on the intermediate `.MuiAccordionSummary-content`
wrapper so the shrink constraint actually reaches `.label`. Verified live against mantine's
`LongTitleTruncation` story — both truncate to a single line with a trailing ellipsis.
