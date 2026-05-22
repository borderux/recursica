import {
  Tooltip as MuiTooltip,
  type TooltipProps as MuiTooltipProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Tooltip.module.css";

// ============================================================
// TOOLTIP
// ============================================================

/**
 * Recursica-specific props for Tooltip.
 */
export interface RecursicaTooltipProps {
  /**
   * Whether to display a beak (arrow) pointing from the tooltip to the target.
   * This is the Recursica equivalent of Mui's `withArrow`.
   * When both `withBeak` and `withArrow` are provided, `withBeak` takes precedence.
   * @default true
   */
  withBeak?: boolean;
}

/**
 * Recursica Tooltip component wrapping Mui's Tooltip.
 *
 * Displays a floating label when the user hovers over or focuses a target element.
 * Unlike HoverCard, Tooltip is a single component (not composable) — content is
 * passed via the `label` prop, and the trigger is passed as `children`.
 *
 * ```tsx
 * <Tooltip label="Helpful information" withBeak>
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 *
 * Static sub-components available via dot-notation:
 * - `// Tooltip.Floating` — Tooltip that follows the cursor
 * - `// Tooltip.Group` — Shared hover delay group for multiple tooltips
 */
export type TooltipProps = RecursicaOverStyled<
  MuiTooltipProps & RecursicaTooltipProps
>;

const TooltipBase = function Tooltip({
  overStyled = false,
  withBeak = true,
  ...rest
}: TooltipProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mui's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    tooltip: styles.tooltip,
    arrow: styles.arrow,
  };

  const classNamesProp = (sanitizedProps as Record<string, unknown>).classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Record<string, string>;
    Object.keys(o).forEach((key) => {
      if (mergedClassNames[key]) {
        mergedClassNames[key] = `${mergedClassNames[key]} ${o[key]}`;
      } else {
        mergedClassNames[key] = o[key];
      }
    });
  }

  // arrowSize must be a JS number prop — Mui uses it for inline width/height
  // and positioning offset (-arrowSize/2) calculations that cannot be CSS-driven.
  // Default to 16 to match the Recursica beak-size token (16px).
  const arrowSize =
    ((sanitizedProps as Record<string, unknown>).arrowSize as
      | number
      | undefined) ?? 16;

  // Resolve withBeak (Recursica) vs withArrow (Mui).
  // withBeak takes precedence when both are provided.
  const withArrow = (sanitizedProps as Record<string, unknown>).withArrow as
    | boolean
    | undefined;
  const resolvedWithArrow = withBeak ?? withArrow;

  return (
    <MuiTooltip
      placement="top" /* Recursica default; Mui defaults to "bottom" */
      multiline /* Always allow text wrapping within max-width */
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classes={mergedClassNames}
      {...(sanitizedProps as unknown as MuiTooltipProps)}
    />
  );
};
TooltipBase.displayName = "Tooltip";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type TooltipComponent = typeof TooltipBase & {
  Floating: typeof MuiTooltip.Floating;
  Group: typeof MuiTooltip.Group;
};

export const Tooltip = TooltipBase as TooltipComponent;
Tooltip.Floating = MuiTooltip.Floating;
Tooltip.Group = MuiTooltip.Group;
