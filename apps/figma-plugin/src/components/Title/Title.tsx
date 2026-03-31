import {
  Title as MantineTitle,
  type TitleProps as MantineTitleProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type TitleOrder = 1 | 2 | 3;

export interface TitleProps extends MantineTitleProps {
  order?: TitleOrder;
  error?: boolean;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ order = 1, error, className, c, ...props }, ref) => {
    // Use error color if error prop is set
    const color = error ? "red" : c;

    return (
      <MantineTitle
        ref={ref}
        order={order}
        c={color}
        className={className}
        {...props}
      />
    );
  },
);

Title.displayName = "Title";
