import {
  Badge as MantineBadge,
  type BadgeProps as MantineBadgeProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type BadgeProps = MantineBadgeProps;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => {
    return <MantineBadge ref={ref} className={className} {...props} />;
  },
);

Badge.displayName = "Badge";
