import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<Pick<import('@mantine/core').MultiSelectProps, "disabled" | "defaultValue" | "onChange" | "value" | "placeholder" | "error"> & {
        data: import('../..').ComboboxItem[];
        label: string;
        showLabel?: boolean;
        leadingIcon?: import('..').IconName;
        isOptional?: boolean;
        labelPlacement?: "top" | "left";
    } & import('../../../../../node_modules/react').RefAttributes<HTMLInputElement>>;
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
        data: {
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
        labelPlacement: {
            control: "select";
            options: string[];
        };
    };
    args: {
        onChange: import('vitest').Mock<(...args: any[]) => any>;
        label: string;
        data: ({
            value: string;
            label: string;
            disabled?: undefined;
        } | {
            value: string;
            label: string;
            disabled: true;
        })[];
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithDefaultValue: Story;
export declare const Disabled: Story;
export declare const SelectedDisabled: Story;
export declare const Error: Story;
export declare const WithPlaceholder: Story;
export declare const NoLabel: Story;
export declare const WithLeadingIcon: Story;
export declare const Optional: Story;
export declare const WithIcon: Story;
export declare const LabelPlacementTop: Story;
export declare const LabelPlacementLeft: Story;
export declare const LabelPlacementLeftWithOptional: Story;
export declare const LabelPlacementLeftWithError: Story;
