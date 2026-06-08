import {
  Popover as MantinePopover,
  type PopoverProps as MantinePopoverProps,
  type PopoverTargetProps as MantinePopoverTargetProps,
  type PopoverDropdownProps as MantinePopoverDropdownProps,
} from "@mantine/core";
import {
  filterStylingProps,
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
export type PopoverProps = RecursicaOverStyled<
  MantinePopoverProps & RecursicaPopoverProps
>;

const PopoverBase = function Popover({
  overStyled = false,
  withBeak = true,
  ...rest
}: PopoverProps) {
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
    <MantinePopover
      position="top" /* Recursica default; Mantine defaults to "bottom" */
      arrowSize={arrowSize}
      withArrow={resolvedWithArrow}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantinePopoverProps)}
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
      className={classNameProp}
      {...(sanitizedProps as unknown as MantinePopoverDropdownProps)}
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
