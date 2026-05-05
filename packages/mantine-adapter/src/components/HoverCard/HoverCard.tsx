import {
  HoverCard as MantineHoverCard,
  type HoverCardProps as MantineHoverCardProps,
  type HoverCardTargetProps as MantineHoverCardTargetProps,
  type HoverCardDropdownProps as MantineHoverCardDropdownProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./HoverCard.module.css";

// ============================================================
// HOVERCARD ROOT
// ============================================================

/**
 * Recursica-specific props for HoverCard.
 */
export interface RecursicaHoverCardProps {
  /**
   * Whether to display a beak (arrow) pointing from the dropdown to the target.
   * This is the Recursica equivalent of Mantine's `withArrow`.
   * When both `withBeak` and `withArrow` are provided, `withBeak` takes precedence.
   */
  withBeak?: boolean;
}

/**
 * Recursica HoverCard component wrapping Mantine's composable HoverCard.
 *
 * Displays a dropdown panel when the user hovers over a target element.
 * Uses the composable dot-notation pattern:
 * ```tsx
 * <HoverCard withBeak>
 *   <HoverCard.Target>
 *     <Button>Hover me</Button>
 *   </HoverCard.Target>
 *   <HoverCard.Dropdown>
 *     Content displayed on hover
 *   </HoverCard.Dropdown>
 * </HoverCard>
 * ```
 */
export type HoverCardProps = RecursicaOverStyled<
  MantineHoverCardProps & RecursicaHoverCardProps
>;

const HoverCardBase = function HoverCard({
  overStyled = false,
  withBeak = true,
  ...rest
}: HoverCardProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mantine's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    dropdown: styles.dropdown,
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
    <MantineHoverCard
      position="top" /* Recursica default; Mantine defaults to "bottom" */
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantineHoverCardProps)}
    />
  );
};
HoverCardBase.displayName = "HoverCard";

// ============================================================
// HOVERCARD TARGET
// ============================================================

/**
 * Wrapper for the element that triggers the hover card.
 * Requires a single child element that supports ref forwarding.
 */
export type HoverCardTargetProps = MantineHoverCardTargetProps;

const HoverCardTarget = function HoverCardTarget(props: HoverCardTargetProps) {
  return <MantineHoverCard.Target {...props} />;
};
HoverCardTarget.displayName = "HoverCardTarget";

// ============================================================
// HOVERCARD DROPDOWN
// ============================================================

/** The dropdown panel displayed when hovering over the target. */
export type HoverCardDropdownProps =
  RecursicaOverStyled<MantineHoverCardDropdownProps>;

const HoverCardDropdown = function HoverCardDropdown({
  overStyled = false,
  ...rest
}: HoverCardDropdownProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineHoverCard.Dropdown
      className={classNameProp}
      {...(sanitizedProps as unknown as MantineHoverCardDropdownProps)}
    />
  );
};
HoverCardDropdown.displayName = "HoverCardDropdown";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type HoverCardComponent = typeof HoverCardBase & {
  Target: typeof HoverCardTarget;
  Dropdown: typeof HoverCardDropdown;
};

export const HoverCard = HoverCardBase as HoverCardComponent;
HoverCard.Target = HoverCardTarget;
HoverCard.Dropdown = HoverCardDropdown;
