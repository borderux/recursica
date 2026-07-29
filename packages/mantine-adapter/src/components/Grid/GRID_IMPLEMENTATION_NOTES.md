# Grid Implementation Notes

The `Grid` component is a generic 12-column (by default) layout wrapper mapped directly to Mantine's `Grid`/`Grid.Col`. It requires no custom logical layouts or CSS workarounds — Mantine handles column geometry, breakpoints, and wrapping natively.

The one deliberate divergence from Mantine's native API: the public `gap` prop replaces Mantine's `gutter`, for naming consistency with the other primitive layout components (`Flex`, `Stack`, `Group`). `gap` is translated to Mantine's `gutter` prop internally via `mapLayoutProps`, the same utility used to resolve `rec-*` spacing tokens elsewhere.

`Grid.Col`'s `span`, `offset`, `order`, `visibleFrom`, and `hiddenFrom` props are passed straight through to Mantine's `Grid.Col` unchanged — Mantine already uses generic, portable naming for these.

Like the other primitive layout components, `Grid` and `Grid.Col` use `WithRecursicaSpacing<T>` rather than `RecursicaOverStyled<T>` and are listed in the "Primitive Layout Components Exemption" section of `OVERSTYLING.md`.
