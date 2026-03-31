import {
  Stack as MantineStack,
  type StackProps as MantineStackProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type StackProps = MantineStackProps;

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = "md", className, ...props }, ref) => {
    return (
      <MantineStack ref={ref} gap={gap} className={className} {...props} />
    );
  },
);

Stack.displayName = "Stack";
