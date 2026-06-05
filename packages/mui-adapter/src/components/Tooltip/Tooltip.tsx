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
import { type RecursicaTooltipProps } from "@recursica/adapter-common";

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
  label,
  opened,
  ...rest
}: TooltipProps & { label?: React.ReactNode; opened?: boolean }) {
  const { title, ...restProps } = rest;
  const sanitizedProps = filterStylingProps(restProps, overStyled);

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

  const withArrow = (sanitizedProps as Record<string, unknown>).withArrow as
    | boolean
    | undefined;
  const resolvedWithArrow = withBeak ?? withArrow;

  return (
    <MuiTooltip
      title={label || title || ""}
      open={opened}
      placement="top" /* Recursica default; Mui defaults to "bottom" */
      arrow={resolvedWithArrow}
      classes={mergedClassNames}
      {...(sanitizedProps as unknown as Omit<MuiTooltipProps, "title">)}
    />
  );
};
TooltipBase.displayName = "Tooltip";

export const Tooltip = TooltipBase;
