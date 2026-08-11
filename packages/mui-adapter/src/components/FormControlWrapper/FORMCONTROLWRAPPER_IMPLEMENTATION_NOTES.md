# FormControlWrapper Implementation Notes

## Architectural Philosophy

Unlike the Mantine adapter (which tears out `Input.Wrapper` entirely), this adapter still
renders MUI's native `FormControl` as the root — MUI's own `disabled`/`error`/`focused`
cascading via `FormControlContext` to descendants is useful and kept. What's rebuilt on top is
label tracking, ARIA generation, and the help/error text block, mirroring the Mantine adapter's
own approach for consistency across frameworks.

### 1. Self-generated `id` fallback

MUI's `FormControl` doesn't generate or require an `id` itself — every ARIA relationship below
depends on having one. `React.useId()` provides a fallback (`recursica-fc-${generatedId}`)
whenever the caller doesn't pass their own `id`, matching the Mantine adapter, so the aria
wiring below fires by default instead of only when a caller happens to supply an `id`.

### 2. The `cloneElement` ARIA map

Same reasoning as the Mantine adapter: `aria-labelledby`/`aria-describedby`/`aria-errormessage`
are generated from the resolved `id` and injected onto the child field via `React.cloneElement`,
since there's no shared context gluing the field to this wrapper's label/assistive text.

- `aria-describedby` and `aria-errormessage` use **separate ids** (`${id}-assistive` /
  `${id}-error`) rather than one shared id — help text and error text are never both visible
  at once (error takes priority, same as Mantine), but keeping the ids distinct means each
  attribute only ever points at content that's actually relevant to it.
- Neither is set if the child already carries its own explicit `aria-describedby`/
  `aria-errormessage` — `cloneElement` never overwrites a caller's own value.

### 3. Strict `AssistiveElement` coupling

Same as Mantine: no generic MUI `FormHelperText` used directly here. `FormControlWrapper`
renders `<AssistiveElement>` itself, resolving to `"error"` or `"help"` depending on whether
`error` is set, and passing whichever id (`errorId`/`assistiveId`) matches.
