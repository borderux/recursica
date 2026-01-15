import {
  Alert as MantineAlert,
  type AlertProps as MantineAlertProps,
} from "@mantine/core";
import { forwardRef } from "react";
import classes from "./Alert.module.css";

export type AlertVariant = "error" | "success" | "info";

export interface AlertProps
  extends Omit<MantineAlertProps, "color" | "variant"> {
  variant?: AlertVariant;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", className, ...props }, ref) => {
    const variantClass = classes[variant];
    const mantineColor =
      variant === "error" ? "red" : variant === "success" ? "green" : "gray";

    return (
      <MantineAlert
        ref={ref}
        color={mantineColor}
        className={[classes.root, variantClass, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Alert.displayName = "Alert";
