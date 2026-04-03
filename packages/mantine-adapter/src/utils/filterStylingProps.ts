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

export const BLOCKED_STYLING_KEYS = [
  "className",
  "classNames",
  "style",
  "styles",
  "vars", // Internal structure hooks
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
] as const;

export type BlockedStylingKeys = (typeof BLOCKED_STYLING_KEYS)[number];

export type RecursicaOverStyled<T> =
  | (Omit<T, BlockedStylingKeys> & { overStyled?: false | undefined })
  | (T & { overStyled: true });

export function filterStylingProps<T extends Record<string, unknown>>(
  props: T,
  overStyled?: boolean,
): Partial<T> {
  if (overStyled) {
    return props;
  }

  const sanitized = { ...props };

  for (const prop of BLOCKED_STYLING_KEYS) {
    if (prop in sanitized) {
      delete sanitized[prop];
    }
  }

  return sanitized;
}
