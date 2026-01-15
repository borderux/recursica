import {
  Select as MantineSelect,
  type SelectProps as MantineSelectProps,
} from "@mantine/core";
import { forwardRef } from "react";

export interface SelectProps extends MantineSelectProps {
  searchable?: boolean;
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ className, searchable = false, ...props }, ref) => {
    return (
      <MantineSelect
        ref={ref}
        searchable={searchable}
        className={className}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
