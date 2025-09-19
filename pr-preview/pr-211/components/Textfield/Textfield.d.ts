import { TextareaProps } from '@mantine/core';
import { IconName } from '../Icons/Icon';
import { ChangeEventHandler } from '../../../../../node_modules/react';
export type TextfieldProps = Pick<TextareaProps, "disabled" | "error" | "defaultValue" | "value" | "readOnly"> & {
    /**
     * The label of the textfield.
     */
    label: string;
    /**
     * The placeholder of the textfield.
     */
    placeholder?: string;
    /**
     * The icon to display before the input.
     */
    leadingIcon?: IconName;
    /**
     * The icon to display after the input.
     */
    trailingIcon?: IconName;
    /**
     * Whether the label is optional. @default true
     */
    showLabel?: boolean;
    /**
     * Whether the input is optional.
     */
    isOptional?: boolean;
    /**
     * The help text to display below the input.
     */
    helpText?: React.ReactNode;
    /**
     * Whether the input should wrap.
     */
    wrap?: boolean;
    /**
     * Whether the input should be stacked. @default true
     */
    stacked?: boolean;
    /**
     * Whether the input should grow. @default false
     */
    grow?: boolean;
    /**
     * The function to call when the input value changes.
     */
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};
export declare const Textfield: import('../../../../../node_modules/react').ForwardRefExoticComponent<Pick<TextareaProps, "disabled" | "defaultValue" | "value" | "error" | "readOnly"> & {
    /**
     * The label of the textfield.
     */
    label: string;
    /**
     * The placeholder of the textfield.
     */
    placeholder?: string;
    /**
     * The icon to display before the input.
     */
    leadingIcon?: IconName;
    /**
     * The icon to display after the input.
     */
    trailingIcon?: IconName;
    /**
     * Whether the label is optional. @default true
     */
    showLabel?: boolean;
    /**
     * Whether the input is optional.
     */
    isOptional?: boolean;
    /**
     * The help text to display below the input.
     */
    helpText?: React.ReactNode;
    /**
     * Whether the input should wrap.
     */
    wrap?: boolean;
    /**
     * Whether the input should be stacked. @default true
     */
    stacked?: boolean;
    /**
     * Whether the input should grow. @default false
     */
    grow?: boolean;
    /**
     * The function to call when the input value changes.
     */
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
} & import('../../../../../node_modules/react').RefAttributes<HTMLTextAreaElement>>;
