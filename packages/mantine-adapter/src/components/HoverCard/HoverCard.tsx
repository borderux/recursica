import {
  HoverCard as MantineHoverCard,
  type HoverCardProps as MantineHoverCardProps,
  type HoverCardTargetProps as MantineHoverCardTargetProps,
  type HoverCardDropdownProps as MantineHoverCardDropdownProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./HoverCard.module.css";

// ============================================================
// HOVERCARD ROOT
// ============================================================

/**
 * Recursica-specific props for HoverCard.
 */
import { type RecursicaHoverCardProps } from "@recursica/adapter-common";

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
  position = "top", // Recursica default; Mantine defaults to "bottom". Consumers can still override.
  // arrowSize must be a JS number prop — Mantine uses it for inline width/height
  // and positioning offset (-arrowSize/2) calculations that cannot be CSS-driven.
  // Default to 16 to match the Recursica beak-size token (16px). Consumers can still override.
  arrowSize = 16,
  withArrow,
  ...rest
}: HoverCardProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Bind CSS module classes to Mantine's internal classNames API
  const mergedClassNames = mergeClassNames(
    {
      dropdown: styles.dropdown,
      arrow: styles.arrow,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  // Resolve withBeak (Recursica) vs withArrow (Mantine).
  // withBeak takes precedence when both are provided.
  const resolvedWithArrow = withBeak ?? withArrow;

  return (
    <MantineHoverCard
      {...(sanitizedProps as unknown as MantineHoverCardProps)}
      position={position}
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classNames={mergedClassNames}
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
      {...(sanitizedProps as unknown as MantineHoverCardDropdownProps)}
      className={classNameProp}
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
