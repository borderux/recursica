/**
 * filterStylingProps
 *
 * This utility acts as the central gatekeeper for strict design-system adherence across
 * all Recursica components mapped over MUI.
 *
 * PHILOSOPHY:
 * Recursica components are designed to be explicitly sandboxed tokens. Allowing external
 * `className` or MUI style props (`sx`, `classes`, etc.) breaks the design system by
 * allowing developers to leak arbitrary designs into components.
 *
 * By default (`overStyled=false`), this utility actively prevents developers from overriding
 * internal component styles (such as background, colors, typography, or internal classes).
 * It safely *permits* external layout overrides (like `margin` / `m`) so that components can
 * easily be spaced alongside other DOM elements.
 *
 * If a developer passes `overStyled={true}`, this filter allows all styling properties to
 * flow through to the underlying MUI component natively, at the developer's own risk.
 *
 * @param props - The raw component props passed down to the wrapper
 * @param overStyled - Boolean toggle to allow raw external styling. Defaults to false.
 * @returns Sanitized component props safe for internal styling merging
 */

export const BLOCKED_STYLING_KEYS = [
  "className",
  "classes", // MUI specific nested class overrides
  "style",
  "sx", // MUI's primary system style prop

  // Potential Box/Typography system props to block (if we wrap those)
  "color",
  "bgcolor",
  "backgroundColor",
  "typography",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "border",
  "borderTop",
  "borderBottom",
  "borderLeft",
  "borderRight",
  "borderColor",
  "borderRadius",
  "boxShadow",
  "display",
  "position",
  "zIndex",
] as const;
export {
  type RecursicaSpacing,
  type RecursicaSize,
  type RecursicaOverStyled,
  type BlockedStylingKeys,
  type ForbiddenStyles,
} from "@recursica/adapter-common";

const LAYOUT_PROPS = new Set([
  "m",
  "my",
  "mx",
  "mt",
  "mb",
  "ml",
  "mr",
  "p",
  "py",
  "px",
  "pt",
  "pb",
  "pl",
  "pr",
  "gap",
  "rowGap",
  "columnGap",
  "top",
  "left",
  "bottom",
  "right",
]);

export const SPACING_MAP: Record<string, string> = {
  "rec-none": "var(--recursica_brand_dimensions_general_none)",
  "rec-sm": "var(--recursica_brand_dimensions_general_sm)",
  "rec-default": "var(--recursica_brand_dimensions_general_default)",
  "rec-md": "var(--recursica_brand_dimensions_general_md)",
  "rec-lg": "var(--recursica_brand_dimensions_general_lg)",
  "rec-xl": "var(--recursica_brand_dimensions_general_xl)",
  "rec-2xl": "var(--recursica_brand_dimensions_general_2xl)",
};

export type OmitSx<T> = Omit<T, "sx">;

export function filterSxProp<T extends Record<string, unknown>>(
  props: T,
): Omit<T, "sx"> {
  const sanitized = { ...props };
  if ("sx" in sanitized) {
    delete sanitized["sx"];
  }
  return sanitized as Omit<T, "sx">;
}

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

  // Intercept Recursica spacing tokens for valid layout properties
  for (const [key, value] of Object.entries(sanitized)) {
    if (
      typeof value === "string" &&
      value.startsWith("rec-") &&
      LAYOUT_PROPS.has(key)
    ) {
      if (value in SPACING_MAP) {
        (sanitized as Record<string, unknown>)[key] = SPACING_MAP[value];
      }
    }
  }

  return sanitized;
}
