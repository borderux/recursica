import {
  DatePickerInput,
  type DatePickerInputProps as ManDatePickerInputProps,
} from "@mantine/dates";
import { forwardRef } from "react";
import { styles } from "./Datepicker.css";

export interface DatePickerInputProps
  extends Pick<ManDatePickerInputProps, "value" | "defaultDate" | "onChange"> {
  label: string;
}

export const Datepicker = forwardRef<HTMLButtonElement, DatePickerInputProps>(
  (props, ref) => {
    return (
      <DatePickerInput
        ref={ref}
        popoverProps={{
          classNames: {
            dropdown: styles.dropdown,
          },
        }}
        hideOutsideDates
        placeholder="MM/DD/YYYY"
        {...props}
        classNames={styles}
      />
    );
  },
);

Datepicker.displayName = "Datepicker";
