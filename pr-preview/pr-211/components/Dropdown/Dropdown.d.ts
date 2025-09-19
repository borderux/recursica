import { SelectProps } from '@mantine/core';
import { IconName } from '../Icons/Icon';
import { ComboboxItem } from '../../types';
export type DropdownProps = Pick<SelectProps, "onChange" | "placeholder" | "disabled" | "error" | "defaultValue" | "value" | "readOnly"> & {
    /**
     * The data to display in the dropdown.
     */
    data: ComboboxItem[];
    /**
     * The label of the dropdown.
     */
    label: string;
    /**
     * Whether to show the label @default true
     */
    showLabel?: boolean;
    /**
     * The icon to display in the left section of the dropdown. @default undefined
     */
    leadingIcon?: IconName;
    /**
     * Whether the label is optional. @default false
     */
    isOptional?: boolean;
    /**
     * The placement of the label relative to the dropdown. @default 'top'
     */
    labelPlacement?: "top" | "left";
};
export declare const Dropdown: import('../../../../../node_modules/react').ForwardRefExoticComponent<Pick<SelectProps, "disabled" | "defaultValue" | "onChange" | "value" | "placeholder" | "error" | "readOnly"> & {
    /**
     * The data to display in the dropdown.
     */
    data: ComboboxItem[];
    /**
     * The label of the dropdown.
     */
    label: string;
    /**
     * Whether to show the label @default true
     */
    showLabel?: boolean;
    /**
     * The icon to display in the left section of the dropdown. @default undefined
     */
    leadingIcon?: IconName;
    /**
     * Whether the label is optional. @default false
     */
    isOptional?: boolean;
    /**
     * The placement of the label relative to the dropdown. @default 'top'
     */
    labelPlacement?: "top" | "left";
} & import('../../../../../node_modules/react').RefAttributes<HTMLInputElement>>;
