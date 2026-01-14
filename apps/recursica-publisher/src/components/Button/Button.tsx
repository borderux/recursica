import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from "@mantine/core";
import { forwardRef } from "react";

// Use Mantine's native variants: "filled", "light", "outline", "subtle", "default", "gradient", "transparent"
export type ButtonVariant = MantineButtonProps["variant"];

// Use Mantine's native sizes: "xs", "sm", "md", "lg", "xl"
export type ButtonSize = MantineButtonProps["size"];

// Use Mantine's color system for semantic meaning
export type ButtonColor = MantineButtonProps["color"];

export interface ButtonProps
  extends Omit<MantineButtonProps, "variant" | "size" | "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "outline", size = "md", color, className, disabled, ...props },
    ref,
  ) => {
    return (
      <MantineButton
        ref={ref}
        variant={variant}
        size={size}
        color={color}
        className={className}
        disabled={disabled}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
