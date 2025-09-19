import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<Pick<import('@mantine/core').TextareaProps, "disabled" | "defaultValue" | "value" | "error" | "readOnly"> & {
        label: string;
        placeholder?: string;
        leadingIcon?: import('..').IconName;
        trailingIcon?: import('..').IconName;
        showLabel?: boolean;
        isOptional?: boolean;
        helpText?: React.ReactNode;
        wrap?: boolean;
        stacked?: boolean;
        grow?: boolean;
        onChange?: import('../../../../../node_modules/react').ChangeEventHandler<HTMLTextAreaElement>;
    } & import('../../../../../node_modules/react').RefAttributes<HTMLTextAreaElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        onChange: {
            table: {
                disable: true;
            };
        };
        disabled: {
            control: "boolean";
        };
        error: {
            control: "text";
        };
        placeholder: {
            control: "text";
        };
        label: {
            control: "text";
        };
    };
    args: {
        label: string;
        onChange: import('vitest').Mock<(...args: any[]) => any>;
    };
    render: (args: Pick<import('@mantine/core').TextareaProps, "disabled" | "defaultValue" | "value" | "error" | "readOnly"> & {
        label: string;
        placeholder?: string;
        leadingIcon?: import('..').IconName;
        trailingIcon?: import('..').IconName;
        showLabel?: boolean;
        isOptional?: boolean;
        helpText?: React.ReactNode;
        wrap?: boolean;
        stacked?: boolean;
        grow?: boolean;
        onChange?: import('../../../../../node_modules/react').ChangeEventHandler<HTMLTextAreaElement>;
    } & import('../../../../../node_modules/react').RefAttributes<HTMLTextAreaElement>) => import("react/jsx-runtime").JSX.Element;
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const LabelMandatory: Story;
export declare const LabelMandatoryWithError: Story;
export declare const LabelMandatoryDisabled: Story;
export declare const LabelMandatoryWithHelpText: Story;
export declare const LabelMandatoryWithLeadingIcon: Story;
export declare const LabelMandatoryWithTrailingIcon: Story;
export declare const LabelMandatoryValued: Story;
export declare const LabelMandatoryValuedWithError: Story;
export declare const LabelMandatoryValuedDisabled: Story;
export declare const LabelMandatoryValuedHelpText: Story;
export declare const LabelMandatoryValuedLeadingIcon: Story;
export declare const LabelMandatoryValuedTrailingIcon: Story;
export declare const LabelMandatoryValuedReadOnly: Story;
