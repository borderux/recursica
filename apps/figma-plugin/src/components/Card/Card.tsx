import { Paper, type PaperProps } from "@mantine/core";
import { forwardRef } from "react";
import classes from "./Card.module.css";

export type CardVariant =
  | "default"
  | "error"
  | "success"
  | "info"
  | "selectable";

export interface CardProps extends PaperProps {
  variant?: CardVariant;
  selected?: boolean;
  paddingLarge?: boolean;
  borderRadiusLarge?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      selected = false,
      paddingLarge = false,
      borderRadiusLarge = false,
      className,
      ...props
    },
    ref,
  ) => {
    const variantClass = classes[variant];
    const selectedClass =
      variant === "selectable" && selected
        ? classes.selectableSelected
        : undefined;
    const paddingClass = paddingLarge ? classes.paddingLarge : undefined;
    const radiusClass = borderRadiusLarge
      ? classes.borderRadiusLarge
      : undefined;

    return (
      <Paper
        ref={ref}
        className={[
          classes.root,
          variantClass,
          selectedClass,
          paddingClass,
          radiusClass,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
