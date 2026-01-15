import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";
import { forwardRef } from "react";

export type CheckboxProps = MantineCheckboxProps;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return <MantineCheckbox ref={ref} className={className} {...props} />;
  },
);

Checkbox.displayName = "Checkbox";
