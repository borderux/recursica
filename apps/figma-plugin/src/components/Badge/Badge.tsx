import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
} from "@mantine/core";
import { forwardRef } from "react";
import classes from "./Badge.module.css";

/**
 * Known badge status types with fixed styling
 */
export type BadgeStatus = "NEW" | "UPDATED" | "EXISTING";

export interface BadgeProps extends MantineBadgeProps {
  /**
   * Known badge status type (NEW, UPDATED, EXISTING)
   * When provided, uses fixed styling and ignores color/variant props
   */
  status?: BadgeStatus;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ status, className, color, variant, children, ...props }, ref) => {
    // If status is provided, use fixed styling for known badges
    if (status) {
      let statusColor: string;
      const statusVariant: MantineBadgeProps["variant"] = "light";
      let statusClassName = className;

      switch (status) {
        case "NEW":
          statusColor = "success";
          statusClassName = `${classes.badgeNew} ${className || ""}`.trim();
          break;
        case "UPDATED":
          statusColor = "warning";
          statusClassName = `${classes.badgeUpdated} ${className || ""}`.trim();
          break;
        case "EXISTING":
          statusColor = "gray";
          statusClassName =
            `${classes.badgeExisting} ${className || ""}`.trim();
          break;
      }

      return (
        <MantineBadge
          ref={ref}
          color={statusColor}
          variant={statusVariant}
          className={statusClassName}
          {...props}
        >
          {status}
        </MantineBadge>
      );
    }

    // Otherwise, use standard Mantine Badge with provided props
    return (
      <MantineBadge
        ref={ref}
        color={color}
        variant={variant}
        className={className}
        {...props}
      >
        {children}
      </MantineBadge>
    );
  },
);

Badge.displayName = "Badge";
