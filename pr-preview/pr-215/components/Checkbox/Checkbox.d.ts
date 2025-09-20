import { CheckboxProps as ManCheckboxProps, CheckboxGroupProps as ManCheckboxGroupProps } from '@mantine/core';
export interface CheckboxLabelProps {
    label: string;
    optional?: boolean;
}
export interface CheckboxGroupProps extends Pick<ManCheckboxGroupProps, "children" | "onChange" | "defaultValue" | "value"> {
    label: string;
    optional?: boolean;
    labelPlacement?: "top" | "left";
}
export interface CheckboxProps extends Pick<ManCheckboxProps, "value" | "checked" | "indeterminate" | "onChange" | "disabled" | "name" | "defaultChecked" | "aria-label"> {
    label: string;
    /**
     * Whether to show the label text next to the checkbox.
     * If false, the label will be hidden and only the checkbox will be visible.
     * This is useful for cases where the checkbox is used as a toggle without a label.
     * @default true
     */
    showLabel?: boolean;
}
interface CheckboxComponentType extends React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> {
    Group: React.ForwardRefExoticComponent<CheckboxGroupProps & React.RefAttributes<HTMLDivElement>>;
}
export declare const Checkbox: CheckboxComponentType;
export {};
