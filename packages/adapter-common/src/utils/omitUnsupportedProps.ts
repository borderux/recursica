/**
 * omitUnsupportedProps
 *
 * Shared across every adapter. Where `filterStylingProps` blocks the fixed set of styling
 * escape hatches (className, style, sx, etc.), this utility deletes a component-declared list
 * of named props that component doesn't support at all — e.g. a native prop the underlying
 * library exposes but Recursica intentionally doesn't map (`size`, `color`, `radius`, ...).
 *
 * `Omit<LibraryProps, "size">` on the public type already stops well-typed callers. This is the
 * runtime backstop: a plain-JavaScript caller (or anyone forcing the type) can still put `size`
 * on the props object, and without this it would leak straight through `...rest` into the
 * wrapped component. Call this immediately after `filterStylingProps`, on every component
 * (including sub-components merged onto a parent, e.g. `Table.Th`), declaring the omitted keys
 * as a local `UNSUPPORTED_PROPS` const with a comment per prop explaining why it's unsupported.
 *
 * @param props - Props already run through `filterStylingProps`
 * @param unsupportedProps - Component-declared list of prop names to delete. Typed as
 *   `PropertyKey`, not `keyof T`, on purpose: `T` is the already-narrowed `rest`/`sanitizedProps`
 *   type, which typically has these props `Omit<>`'d out of it already — the whole point of
 *   `UNSUPPORTED_PROPS` is to still catch them at runtime. Type `UNSUPPORTED_PROPS` itself
 *   against the underlying library's full props type instead, e.g.
 *   `as const satisfies readonly (keyof MantineButtonProps)[]`.
 * @returns `props` with every key in `unsupportedProps` removed
 */
export function omitUnsupportedProps<T extends Record<string, unknown>>(
  props: T,
  unsupportedProps: readonly PropertyKey[],
): Partial<T> {
  const sanitized: Record<PropertyKey, unknown> = { ...props };

  for (const prop of unsupportedProps) {
    if (prop in sanitized) {
      delete sanitized[prop];
    }
  }

  return sanitized as Partial<T>;
}
