---
"@recursica/mui-adapter": patch
---

FormControlWrapper (MUI): fixed ARIA wiring to match the Mantine adapter — a self-generated
`id` fallback (via `useId`) now fires by default instead of only when a caller supplies their
own `id`, and help/error text each get their own id (`aria-describedby`/`aria-errormessage`)
instead of sharing one. Neither attribute is set if the child already has its own explicit
value.
