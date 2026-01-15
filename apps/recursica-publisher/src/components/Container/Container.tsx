import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type ContainerProps = MantineContainerProps;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <MantineContainer
        ref={ref}
        size={size}
        className={className}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";
