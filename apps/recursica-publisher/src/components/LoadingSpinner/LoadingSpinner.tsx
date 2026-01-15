import { forwardRef } from "react";
import classes from "./LoadingSpinner.module.css";

export type LoadingSpinnerSize = "small" | "default";

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: "default" | "primary";
  className?: string;
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "default", color = "default", className }, ref) => {
    const sizeClass =
      size === "small" ? classes.sizeSmall : classes.sizeDefault;
    const colorClass = color === "primary" ? classes.colorPrimary : undefined;

    return (
      <div
        ref={ref}
        className={[classes.root, sizeClass, colorClass, className]
          .filter(Boolean)
          .join(" ")}
      />
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";
