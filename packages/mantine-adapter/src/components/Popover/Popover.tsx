import {
  Popover as MantinePopover,
  type PopoverProps as MantinePopoverProps,
  type PopoverTargetProps as MantinePopoverTargetProps,
  type PopoverDropdownProps as MantinePopoverDropdownProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  withCallerOverride,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Popover.module.css";

// ============================================================
// POPOVER ROOT
// ============================================================

/**
 * Recursica-specific props for Popover.
 */
import { type RecursicaPopoverProps } from "@recursica/adapter-common";

/**
 * Recursica Popover component wrapping Mantine's composable Popover.
 *
 * Displays a dropdown panel when the user clicks or interacts with a target element.
 * Uses the composable dot-notation pattern:
 * ```tsx
 * <Popover withBeak>
 *   <Popover.Target>
 *     <Button>Click me</Button>
 *   </Popover.Target>
 *   <Popover.Dropdown>
 *     Content displayed in popover
 *   </Popover.Dropdown>
 * </Popover>
 * ```
 */
export type PopoverProps = Omit<
  RecursicaOverStyled<
    Omit<MantinePopoverProps, "position"> & RecursicaPopoverProps
  >,
  "position"
> & {
  position?: MantinePopoverProps["position"];
};

const PopoverBase = function Popover({
  overStyled = false,
  withBeak = true,
  position = "top", // Recursica default; Mantine defaults to "bottom"
  ...rest
}: PopoverProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Bind CSS module classes to Mantine's internal classNames API
  const mergedClassNames = mergeClassNames(
    { dropdown: styles.dropdown, arrow: styles.arrow },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  // arrowSize must be a JS number prop — Mantine uses it for inline width/height
  // and positioning offset (-arrowSize/2) calculations that cannot be CSS-driven.
  // Default to 16 to match the Recursica beak-size token (16px).
  const arrowSize = withCallerOverride<number>(
    16,
    restRecord.arrowSize as number | undefined,
  );

  // Resolve withBeak (Recursica) vs withArrow (Mantine).
  // withBeak takes precedence when both are provided.
  const resolvedWithArrow = withCallerOverride<boolean | undefined>(
    withBeak,
    restRecord.withArrow as boolean | undefined,
  );

  return (
    <MantinePopover
      {...(sanitizedProps as unknown as MantinePopoverProps)}
      position={position}
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classNames={mergedClassNames}
    />
  );
};
PopoverBase.displayName = "Popover";

// ============================================================
// POPOVER TARGET
// ============================================================

/**
 * Wrapper for the element that triggers the popover.
 * Requires a single child element that supports ref forwarding.
 */
export type PopoverTargetProps = MantinePopoverTargetProps;

const PopoverTarget = function PopoverTarget(props: PopoverTargetProps) {
  return <MantinePopover.Target {...props} />;
};
PopoverTarget.displayName = "PopoverTarget";

// ============================================================
// POPOVER DROPDOWN
// ============================================================

/** The dropdown panel displayed from the popover. */
export type PopoverDropdownProps =
  RecursicaOverStyled<MantinePopoverDropdownProps>;

const PopoverDropdown = function PopoverDropdown({
  overStyled = false,
  ...rest
}: PopoverDropdownProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantinePopover.Dropdown
      {...(sanitizedProps as unknown as MantinePopoverDropdownProps)}
      className={classNameProp}
    />
  );
};
PopoverDropdown.displayName = "PopoverDropdown";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type PopoverComponent = typeof PopoverBase & {
  Target: typeof PopoverTarget;
  Dropdown: typeof PopoverDropdown;
};

export const Popover = PopoverBase as PopoverComponent;
Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;
