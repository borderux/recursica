import {
  Tooltip as MantineTooltip,
  type TooltipProps as MantineTooltipProps,
} from "@mantine/core";
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
import { type RecursicaTooltipProps } from "@recursica/adapter-common";

/**
 * Recursica Tooltip component wrapping Mantine's Tooltip.
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
 * - `Tooltip.Floating` — Tooltip that follows the cursor
 * - `Tooltip.Group` — Shared hover delay group for multiple tooltips
 */
export type TooltipProps = RecursicaOverStyled<
  MantineTooltipProps & RecursicaTooltipProps
>;

const TooltipBase = function Tooltip({
  overStyled = false,
  withBeak = true,
  ...rest
}: TooltipProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mantine's internal classNames API
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

  // arrowSize must be a JS number prop — Mantine uses it for inline width/height
  // and positioning offset (-arrowSize/2) calculations that cannot be CSS-driven.
  // Default to 16 to match the Recursica beak-size token (16px).
  const arrowSize =
    ((sanitizedProps as Record<string, unknown>).arrowSize as
      | number
      | undefined) ?? 16;

  // Resolve withBeak (Recursica) vs withArrow (Mantine).
  // withBeak takes precedence when both are provided.
  const withArrow = (sanitizedProps as Record<string, unknown>).withArrow as
    | boolean
    | undefined;
  const resolvedWithArrow = withBeak ?? withArrow;

  return (
    <MantineTooltip
      position="top" /* Recursica default; Mantine defaults to "bottom" */
      multiline /* Always allow text wrapping within max-width */
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantineTooltipProps)}
    />
  );
};
TooltipBase.displayName = "Tooltip";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type TooltipComponent = typeof TooltipBase & {
  Floating: typeof MantineTooltip.Floating;
  Group: typeof MantineTooltip.Group;
};

export const Tooltip = TooltipBase as TooltipComponent;
Tooltip.Floating = MantineTooltip.Floating;
Tooltip.Group = MantineTooltip.Group;
