# AssistiveElement – implementation notes

Decisions and design tweaks specific to the UI Kit's AssistiveElement wrapped against
`@mui/material`.

---

## 1. Forced `component="div"` trades away `FormHelperText`'s default semantics

**Decision:** `FormHelperText` renders a `<p>` by default — a reasonable semantic choice for
standalone helper/error text. This adapter forces `component="div"` instead, purely so the
icon + text can sit side by side in a flex row; `<p>` can't contain the flex layout the same
way without other tradeoffs.
**Implementation:** `component="div"` and `error={isError}` (derived from `assistiveVariant`)
are both computed internally and omitted from `AssistiveElementProps` (`Omit<FormHelperTextProps,
"error" | "component">`) so a caller can't silently override either via spread.
`aria-describedby`/`aria-errormessage` association with a field is a different story: this
component has no reference to any sibling field, so it can't wire that itself. It's already
handled one layer up, in `FormControlWrapper` — which generates the ids, passes them down via
this component's own `id` prop, and clones `aria-describedby`/`aria-errormessage` onto the
field. Only a fully standalone `<AssistiveElement>` used outside `FormControlWrapper` still
needs that wiring done by hand. `role="alert"` for the error variant is handled here instead
(see §4) — that piece genuinely belongs at this component's own level.

---

## 2. CSS specificity tie against MUI's own `.Mui-error` color

**Decision:** MUI's `FormHelperText` sets its own error color via `.MuiFormHelperText-root.Mui-error`
(two classes) whenever `error` is set. Our own `.root[data-variant="error"]` (one class + one
attribute) lands at the _same_ specificity — without help, whichever rule loads later in the
merged stylesheet wins, which is import-order luck rather than a deterministic override.
**Implementation:** `!important` on that one rule's `color` guarantees ours wins regardless of
load order (same reasoning as the focus-ring override in the Accordion adapter). Not needed for
the `help` variant — MUI's unconditional base `color` on `.root` alone already has lower
specificity than our attribute-qualified rule there.

---

## 3. Native passthrough capabilities, left unblocked and undocumented

**Decision:** `FormHelperText`'s own `disabled`/`filled`/`focused`/`margin`/`required`/`variant`/
`classes`/`sx` all pass straight through today (none of them are omitted, and none are
computed internally so there's nothing for them to silently override). They're also not added
to `RecursicaAssistiveElementProps` — same "accidental passthrough" class as Accordion's
`disabled` was before it got formalized. Known asymmetry: MUI callers can reach for these
today, Mantine callers can't (Mantine's `AssistiveElement` wraps no native component at all).
Revisit if a real use case shows up for any of them.

---

## 4. `role="alert"` defaults on for the error variant

**Decision:** Error text needs to be announced by assistive tech as it appears or changes;
static help text doesn't. Rather than requiring every integrator to remember `role="alert"`,
`assistiveVariant="error"` defaults it automatically.
**Implementation:** `role` is destructured out and resolved as `role ?? (isError ? "alert" :
undefined)` before rendering — an explicit caller-supplied `role` always wins over the default,
and `"help"` gets no default at all.
