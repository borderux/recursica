import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Tooltip as MuiTooltip,
  type TooltipProps as MuiTooltipProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Popover.module.css";

// ============================================================
// POPOVER ROOT
// ============================================================

import { type RecursicaPopoverProps } from "@recursica/adapter-common";

/**
 * Behavioral props specific to this adapter's click-controlled implementation.
 * `withBeak` comes from the shared `RecursicaPopoverProps` (adapter-common); the
 * rest map to Mantine's own `PopoverProps` surface, reproduced here since Mui has
 * no single library type that already covers them.
 */
export interface PopoverOwnProps extends RecursicaPopoverProps {
  /** Dropdown position relative to the target */
  position?: MuiTooltipProps["placement"];
  /** Initial opened state (uncontrolled) */
  defaultOpened?: boolean;
  /** Controlled opened state */
  opened?: boolean;
  /** Called whenever the opened state changes */
  onChange?: (opened: boolean) => void;
  /** Distance in px between the dropdown and the target */
  offset?: number;
  /** Fixed width applied to the dropdown panel */
  width?: number | string;
  children?: React.ReactNode;
}

/**
 * Recursica Popover component wrapping Mui's Tooltip in click-controlled mode.
 *
 * Displays a dropdown panel when the user clicks the target element.
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
  Omit<
    MuiTooltipProps,
    "title" | "children" | "open" | "onClose" | "onOpen" | "placement"
  > &
    PopoverOwnProps
>;

const PopoverBase = function Popover({
  overStyled = false,
  withBeak = true,
  position = "top",
  defaultOpened = false,
  opened,
  onChange,
  offset = 8,
  width,
  children,
  ...rest
}: PopoverProps) {
  const sanitizedProps = filterStylingProps(
    rest as Record<string, unknown>,
    overStyled,
  );

  // Bind CSS module classes to Mui's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    tooltip: styles.dropdown,
    arrow: styles.arrow,
  };

  const classesProp = (sanitizedProps as Record<string, unknown>).classes;
  if (
    classesProp &&
    typeof classesProp === "object" &&
    !Array.isArray(classesProp)
  ) {
    const o = classesProp as Record<string, string>;
    Object.keys(o).forEach((key) => {
      mergedClassNames[key] = mergedClassNames[key]
        ? `${mergedClassNames[key]} ${o[key]}`
        : o[key];
    });
  }

  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const isControlled = opened !== undefined;
  const currentOpened = isControlled ? (opened as boolean) : internalOpened;

  const setOpened = (next: boolean) => {
    if (!isControlled) setInternalOpened(next);
    onChange?.(next);
  };

  // Find Target and Dropdown children
  let targetNode: React.ReactNode = null;
  let dropdownNode: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const childElement = child as unknown as {
        type?: { displayName?: string };
        props: { children?: React.ReactNode };
      };
      if (childElement.type?.displayName === "PopoverTarget") {
        targetNode = childElement.props.children;
      } else if (childElement.type?.displayName === "PopoverDropdown") {
        dropdownNode = childElement.props.children;
      }
    }
  });

  if (!targetNode) {
    throw new Error("Popover requires a <Popover.Target> child.");
  }
  if (!dropdownNode) {
    throw new Error("Popover requires a <Popover.Dropdown> child.");
  }

  const targetRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Mui's Tooltip has no native "click outside to close" behavior once its own
  // hover/focus/touch listeners are disabled for click-controlled use, so it's
  // implemented here directly (mirrors Mantine's default closeOnClickOutside).
  useEffect(() => {
    if (!currentOpened) return undefined;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (targetRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpened(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOpened]);

  const handleTargetClick = (event: React.MouseEvent) => {
    if (isValidElement(targetNode)) {
      (
        targetNode.props as { onClick?: (e: React.MouseEvent) => void }
      ).onClick?.(event);
    }
    setOpened(!currentOpened);
  };

  // Mui's Tooltip auto-wires `aria-labelledby`/`aria-label` on the target to describe
  // it via the tooltip content once open — correct for an actual tooltip, but wrong here:
  // it would silently replace the target's own accessible name (e.g. a Button's label)
  // with the popover's body text. Explicitly reset both so the target keeps its own name.
  const targetAriaOverrides = {
    "aria-haspopup": "dialog" as const,
    "aria-expanded": currentOpened,
    "aria-labelledby": undefined,
    "aria-label": undefined,
  };

  const clonedTarget = isValidElement(targetNode) ? (
    cloneElement(
      targetNode as React.ReactElement,
      {
        onClick: handleTargetClick,
        ref: targetRef,
        ...targetAriaOverrides,
      } as Record<string, unknown>,
    )
  ) : (
    <span
      onClick={handleTargetClick}
      ref={targetRef as unknown as React.Ref<HTMLSpanElement>}
      {...targetAriaOverrides}
    >
      {targetNode}
    </span>
  );

  return (
    <MuiTooltip
      {...(sanitizedProps as unknown as Omit<
        MuiTooltipProps,
        "title" | "children"
      >)}
      title={<div ref={dropdownRef}>{dropdownNode}</div>}
      open={currentOpened}
      onClose={() => setOpened(false)}
      placement={position}
      arrow={withBeak}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, offset],
              },
            },
          ],
        },
        ...(width !== undefined ? { tooltip: { style: { width } } } : {}),
      }}
      classes={mergedClassNames as unknown as MuiTooltipProps["classes"]}
    >
      {clonedTarget}
    </MuiTooltip>
  );
};
PopoverBase.displayName = "Popover";

// ============================================================
// POPOVER TARGET
// ============================================================

/**
 * Wrapper for the element that triggers the popover.
 * Requires a single child element; only used as a marker to locate the
 * trigger element, it is never rendered directly (see `PopoverBase`).
 */
export type PopoverTargetProps = { children?: React.ReactNode };

const PopoverTarget = function PopoverTarget({ children }: PopoverTargetProps) {
  return <>{children}</>;
};
PopoverTarget.displayName = "PopoverTarget";

// ============================================================
// POPOVER DROPDOWN
// ============================================================

/** The dropdown panel displayed from the popover. */
export type PopoverDropdownProps = { children?: React.ReactNode };

const PopoverDropdown = function PopoverDropdown({
  children,
}: PopoverDropdownProps) {
  return <>{children}</>;
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
