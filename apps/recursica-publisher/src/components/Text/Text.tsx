import {
  Text as MantineText,
  type TextProps as MantineTextProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type TextVariant = "body" | "small";
export type TextColor = "default" | "secondary" | "error" | "success";

export interface TextProps extends MantineTextProps {
  variant?: TextVariant;
  color?: TextColor;
  children?: React.ReactNode;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = "body", color = "default", size, className, ...props }, ref) => {
    // Map our variants to Mantine sizes
    const mantineSize = variant === "small" ? "sm" : size || "md";
    // Map our colors to Mantine colors
    const mantineColor =
      color === "error"
        ? "red"
        : color === "success"
          ? "green"
          : color === "secondary"
            ? "gray"
            : undefined;

    return (
      <MantineText
        ref={ref}
        size={mantineSize}
        c={mantineColor}
        className={className}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
