# AssistiveElement – implementation notes

Decisions and design tweaks specific to the UI Kit's AssistiveElement wrapped against
`@mantine/core`.

---

## 1. Plain `<div>` — no underlying component wrapped

**Decision:** Unlike most components in this adapter, `AssistiveElement` doesn't wrap any real
`@mantine/core` component at all — it's a bare `<div>` with two `<span>` wrappers (icon, text).
Mantine has no dedicated helper/error-text component to wrap in the first place (it composes
that presentation ad hoc per-field via `TextInput`'s own `error`/`description` props instead of
a standalone component), so there's nothing here to inherit layout or ARIA semantics from.
**Implementation:** A `<div>` is a reasonable generic container, but it carries no semantic
meaning of its own. `role="alert"` is now defaulted automatically for the `"error"` variant
(see §3) — the one piece of ARIA behavior that genuinely belongs at this component's own level.
`aria-describedby`/`aria-errormessage` association with a field is a different story: this
component has no reference to any sibling field, so it can't wire that itself. It's already
handled one layer up, in `FormControlWrapper` — which generates the ids, passes them down via
this component's own `id` prop, and clones `aria-describedby`/`aria-errormessage` onto the
field. Only a fully standalone `<AssistiveElement>` used outside `FormControlWrapper` still
needs that wiring done by hand, via the standard HTML attributes that pass through `{...rest}`.

---

## 2. Fixed icon per variant, no custom icon slot

**Decision:** `assistiveWithIcon` only toggles visibility — there's no prop to swap in a custom
icon. The icon is always the one belonging to the current `assistiveVariant` (`InfoIcon` for
`"help"`, `AlertIcon` for `"error"`).
**Implementation:** `IconComponent = assistiveVariant === "error" ? AlertIcon : InfoIcon` is
resolved directly in the render body; there's no icon prop in `RecursicaAssistiveElementProps`
to intercept.

---

## 3. `role="alert"` defaults on for the error variant

**Decision:** Error text needs to be announced by assistive tech as it appears or changes;
static help text doesn't. Rather than requiring every integrator to remember `role="alert"`,
`assistiveVariant="error"` defaults it automatically.
**Implementation:** `role` is destructured out and resolved as `role ?? (assistiveVariant ===
"error" ? "alert" : undefined)` before the spread — an explicit caller-supplied `role` always
wins over the default, and `"help"` gets no default at all.
