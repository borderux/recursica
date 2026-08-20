import {
  Tooltip as MuiTooltip,
  type TooltipProps as MuiTooltipProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
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

  // Bind CSS module classes to Mui's internal classNames API. Note MUI's actual prop is
  // "classes", not "classNames" (that's Mantine's naming) — this used to read the wrong key,
  // silently no-op-ing any caller-supplied classes.
  const mergedClassNames = mergeClassNames(
    {
      tooltip: styles.tooltip,
      arrow: styles.arrow,
    },
    (sanitizedProps as Record<string, unknown>).classes as
      | Partial<Record<string, string>>
      | undefined,
  );

  return (
    <MuiTooltip
      {...(sanitizedProps as unknown as Omit<MuiTooltipProps, "title">)}
      title={label || title || ""}
      open={opened}
      placement="top" /* Recursica default; Mui defaults to "bottom" */
      arrow={withBeak}
      classes={mergedClassNames}
    />
  );
};
TooltipBase.displayName = "Tooltip";

export const Tooltip = TooltipBase;
