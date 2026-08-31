# Label Implementation Notes

Decisions and gotchas specific to wrapping `@mui/material`'s `InputLabel` for the UI Kit's Label.

## `labelAlignment` was completely unimplemented

**Found 2026-08-30, source-of-truth audit against mantine.** `ui-kit-label--right-aligned` used
identical story args on both adapters, but only mantine's rendering was actually right-aligned.
Root cause: `labelAlignment` isn't part of MUI `InputLabelProps`, and this component never
destructured or otherwise referenced it — it silently fell into `...rest` and got spread onto
`<InputLabel>` as an unrecognized prop (no visual effect, MUI drops/ignores it). Fixed by
destructuring `labelAlignment` (defaulting to `"left"`, matching mantine), exposing it as
`data-alignment` on the root `<InputLabel>`, and adding
`.root[data-alignment="right"] .innerLayout { justify-content: flex-end; text-align: right; }`
in `Label.module.css` — mirroring mantine-adapter's own `[data-alignment]` selector pattern.

## `labelOptionalText` custom string wasn't wrapped in parentheses

**Found 2026-08-30, source-of-truth audit against mantine.** `ui-kit-label--with-optional-text`
passes a custom string (`"Max 100 characters"`), not the `true` sentinel. This component only
special-cased `labelOptionalText === true` (mapping it to the literal `"(optional)"` string) and
rendered any other value verbatim, with no parentheses — e.g. mantine shows `(Max 100
characters)`, this adapter showed `Max 100 characters`. Mantine's component wraps ANY resolved
string value in parentheses, not just its own boolean-default case. Fixed to match: resolve
`true` to `"optional"` same as before, then wrap the result in parentheses whenever it's a
string (non-string custom nodes, e.g. a caller-supplied element, pass through unwrapped, same as
mantine).
