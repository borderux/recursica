import { DatePickerInputProps as ManDatePickerInputProps } from '@mantine/dates';
export interface DatePickerInputProps extends Pick<ManDatePickerInputProps, "value" | "defaultDate" | "onChange"> {
    label: string;
}
export declare const Datepicker: import('../../../../../node_modules/react').ForwardRefExoticComponent<DatePickerInputProps & import('../../../../../node_modules/react').RefAttributes<HTMLButtonElement>>;
