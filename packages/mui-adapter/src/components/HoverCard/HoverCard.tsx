import React, { isValidElement } from "react";
import {
  Tooltip as MuiTooltip,
  type TooltipProps as MuiTooltipProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./HoverCard.module.css";

// ============================================================
// HOVERCARD ROOT
// ============================================================

export interface RecursicaHoverCardProps {
  withBeak?: boolean;
  position?:
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top"
    | "top-start"
    | "top-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  offset?: number;
  children?: React.ReactNode;
}

export type HoverCardProps = RecursicaOverStyled<
  Omit<MuiTooltipProps, "title" | "children"> & RecursicaHoverCardProps
>;

const HoverCardBase = function HoverCard({
  overStyled = false,
  withBeak = true,
  position = "top",
  openDelay = 0,
  closeDelay = 150,
  disabled = false,
  offset = 5,
  children,
  ...rest
}: HoverCardProps) {
  const sanitizedProps = filterStylingProps(
    rest as Record<string, unknown>,
    overStyled,
  );

  // Bind CSS module classes to Mui's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    tooltip: styles.dropdown,
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

  // Find Target and Dropdown children
  let targetNode: React.ReactNode = null;
  let dropdownNode: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const childElement = child as any;
      if (childElement.type?.displayName === "HoverCardTarget") {
        targetNode = childElement.props.children;
      } else if (childElement.type?.displayName === "HoverCardDropdown") {
        dropdownNode = childElement.props.children;
      }
    }
  });

  if (!targetNode) {
    // Fallback if structure is wrong
    targetNode = <div />;
  }
  if (!dropdownNode) {
    dropdownNode = <div />;
  }

  return (
    <MuiTooltip
      title={dropdownNode}
      placement={position as any}
      arrow={withBeak}
      enterDelay={openDelay}
      leaveDelay={closeDelay}
      disableHoverListener={disabled}
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
      }}
      classes={mergedClassNames as any}
      {...(sanitizedProps as any)}
    >
      {/* Tooltip requires a single valid React element child that accepts a ref */}
      {isValidElement(targetNode) ? targetNode : <span>{targetNode}</span>}
    </MuiTooltip>
  );
};
HoverCardBase.displayName = "HoverCard";

// ============================================================
// HOVERCARD TARGET
// ============================================================

export type HoverCardTargetProps = { children?: React.ReactNode };

const HoverCardTarget = function HoverCardTarget({
  children,
}: HoverCardTargetProps) {
  return <>{children}</>;
};
HoverCardTarget.displayName = "HoverCardTarget";

// ============================================================
// HOVERCARD DROPDOWN
// ============================================================

export type HoverCardDropdownProps = { children?: React.ReactNode };

const HoverCardDropdown = function HoverCardDropdown({
  children,
}: HoverCardDropdownProps) {
  return <>{children}</>;
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
