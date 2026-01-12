import {
  Group as MantineGroup,
  type GroupProps as MantineGroupProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type GroupProps = MantineGroupProps;

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ gap = "md", className, ...props }, ref) => {
    return (
      <MantineGroup ref={ref} gap={gap} className={className} {...props} />
    );
  },
);

Group.displayName = "Group";
