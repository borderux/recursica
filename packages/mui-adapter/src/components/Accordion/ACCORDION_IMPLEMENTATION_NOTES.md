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
