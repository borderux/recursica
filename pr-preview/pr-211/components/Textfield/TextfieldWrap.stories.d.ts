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
        placeholder: string;
        isOptional: true;
        onChange: import('vitest').Mock<(...args: any[]) => any>;
        wrap: true;
        value: string;
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
export declare const LabelOptionalValued: Story;
export declare const LabelOptionalValuedWithError: Story;
export declare const LabelOptionalValuedDisabled: Story;
export declare const LabelOptionalValuedHelpText: Story;
export declare const LabelOptionalValuedLeadingIcon: Story;
export declare const LabelOptionalValuedTrailingIcon: Story;
export declare const LabelOptionalValuedReadOnly: Story;
