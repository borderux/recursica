# Grid Implementation Notes

The `Grid` component is a generic 12-column (by default) layout wrapper mapped directly to Mantine's `Grid`/`Grid.Col`. It requires no custom logical layouts or CSS workarounds — Mantine handles column geometry, breakpoints, and wrapping natively.

Per the layout-components rule (no formal Recursica common props definition — these simply pass through the underlying kit's own props), `Grid` and `Grid.Col` are typed directly off Mantine's own `GridProps`/`GridColProps` with no Recursica-specific prop renaming. The public prop for spacing between columns is Mantine's own `gutter` (previously renamed to `gap` for cross-component consistency — that rename has been reverted since it wasn't a real Mantine prop). `gutter` still accepts `rec-*` spacing tokens, resolved via `mapLayoutProps`, the same utility used elsewhere.

`Grid.Col`'s `span`, `offset`, `order`, `visibleFrom`, and `hiddenFrom` props are passed straight through to Mantine's `Grid.Col` unchanged, using Mantine's own breakpoint scale (`xs`/`sm`/`md`/`lg`/`xl` — there is no `base` breakpoint in Mantine; `xs` is the smallest).

Like the other primitive layout components, `Grid` and `Grid.Col` use `WithRecursicaSpacing<T>` rather than `RecursicaOverStyled<T>` and are listed in the "Primitive Layout Components Exemption" section of `OVERSTYLING.md`.

## Added `ResponsiveSizes` story (2026-08-30, source-of-truth audit)

mui-adapter has a `ui-kit-grid--responsive-sizes` story with no counterpart here — its `story
parity with source of truth` check would otherwise fail for mui-adapter. Added an equivalent
`ResponsiveSizes` story using Mantine's own `span` prop (Mantine's `Grid.Col` has no `size` prop
— see the naming-divergence note above and mui-adapter's own `IMPLEMENTATION_NOTES.md`). This is
functionally identical to the existing `ResponsiveSpans` story above; it exists purely so
mui-adapter's differently-named story id has a source-of-truth golden to diff against.
