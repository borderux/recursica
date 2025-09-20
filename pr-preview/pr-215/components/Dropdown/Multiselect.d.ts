import { MultiSelectProps } from '@mantine/core';
import { IconName } from '../Icons/Icon';
import { ComboboxItem } from '../../types';
export type MultiselectProps = Pick<MultiSelectProps, "onChange" | "placeholder" | "disabled" | "error" | "defaultValue" | "value"> & {
    /**
     * The data to display in the Multiselect.
     */
    data: ComboboxItem[];
    /**
     * The label of the Multiselect.
     */
    label: string;
    /**
     * Whether to show the label @default true
     */
    showLabel?: boolean;
    /**
     * The icon to display in the left section of the Multiselect. @default undefined
     */
    leadingIcon?: IconName;
    /**
     * Whether the label is optional. @default false
     */
    isOptional?: boolean;
    /**
     * The placement of the label relative to the multiselect. @default 'top'
     */
    labelPlacement?: "top" | "left";
};
export declare const Multiselect: import('../../../../../node_modules/react').ForwardRefExoticComponent<Pick<MultiSelectProps, "disabled" | "defaultValue" | "onChange" | "value" | "placeholder" | "error"> & {
    /**
     * The data to display in the Multiselect.
     */
    data: ComboboxItem[];
    /**
     * The label of the Multiselect.
     */
    label: string;
    /**
     * Whether to show the label @default true
     */
    showLabel?: boolean;
    /**
     * The icon to display in the left section of the Multiselect. @default undefined
     */
    leadingIcon?: IconName;
    /**
     * Whether the label is optional. @default false
     */
    isOptional?: boolean;
    /**
     * The placement of the label relative to the multiselect. @default 'top'
     */
    labelPlacement?: "top" | "left";
} & import('../../../../../node_modules/react').RefAttributes<HTMLInputElement>>;
