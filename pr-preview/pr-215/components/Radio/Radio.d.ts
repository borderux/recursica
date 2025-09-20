import { RadioProps as ManRadioProps, RadioGroupProps as ManRadioGroupProps } from '@mantine/core';
export interface RadioLabelProps {
    label: string;
    optional?: boolean;
}
export interface RadioGroupProps extends Pick<ManRadioGroupProps, "name" | "children" | "onChange" | "defaultValue" | "value"> {
    label: string;
    optional?: boolean;
}
export interface RadioProps extends Pick<ManRadioProps, "value" | "checked" | "onChange" | "disabled" | "name" | "defaultChecked" | "aria-label"> {
    /**
     * If true, the label will be hidden and the radio will be shown as a standalone item.
     * @default true
     */
    showLabel?: boolean;
    /**
     * The label for the radio.
     */
    label: string;
}
interface RadioComponentType extends React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>> {
    Group: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
}
export declare const Radio: RadioComponentType;
export {};
