/**
 * filterStylingProps
 *
 * This utility acts as the central gatekeeper for strict design-system adherence across
 * all Recursica components mapped over Mantine.
 *
 * PHILOSOPHY:
 * Recursica components are designed to be explicitly sandboxed tokens. Allowing external
 * `className` or Mantine style system props (`bg`, `p`, etc.) breaks the design system by
 * allowing developers to leak arbitrary designs into components.
 *
 * By default (`overStyled=false`), this utility actively prevents developers from overriding
 * internal component styles (such as background, colors, typography, or internal classNames).
 * It safely *permits* external layout overrides (like `margin` / `m`) so that components can
 * easily be spaced alongside other DOM elements.
 *
 * If a developer passes `overStyled={true}`, this filter allows all styling properties to
 * flow through to the underlying Mantine component natively, at the developer's own risk.
 *
 * @param props - The raw component props passed down to the wrapper
 * @param overStyled - Boolean toggle to allow raw external styling. Defaults to false.
 * @returns Sanitized component props safe for internal styling merging
 */
export function filterStylingProps<T extends Record<string, unknown>>(
  props: T,
  overStyled?: boolean,
): Partial<T> {
  // If explicitly requested to allow external overrides, pass everything untouched.
  if (overStyled) {
    return props;
  }

  const sanitized = { ...props };

  // Specific internal structure hooks
  const internalHooks = ["className", "classNames", "style", "styles", "vars"];

  // Mantine generic system props mapping to internal layout/color changes.
  // Note: External layout props like `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`, `pos`, `top` etc.,
  // are intentionally EXCLUDED from this list to allow component alignment in external DOMs.
  const visualSystemProps = [
    "p",
    "px",
    "py",
    "pt",
    "pb",
    "pl",
    "pr", // Padding
    "bg",
    "c",
    "opacity", // Color
    "ff",
    "fz",
    "fw",
    "lts",
    "ta",
    "lh",
    "fs",
    "tt",
    "td", // Typography
    "bd",
    "bdw",
    "bds",
    "bdc",
    "bdr", // Borders
    "shadow", // Effects
  ];

  const blockedProps = [...internalHooks, ...visualSystemProps];

  for (const prop of blockedProps) {
    if (prop in sanitized) {
      delete sanitized[prop];
    }
  }

  return sanitized;
}
