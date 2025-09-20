import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Chip').ChipProps & import('../../../../../node_modules/react').RefAttributes<HTMLInputElement>> & {
        Group: {
            <T extends boolean = false>(props: import('./Chip').ChipGroupProps<T>): import("react/jsx-runtime").JSX.Element;
            displayName: string;
        };
    };
    decorators: never[];
    parameters: {
        layout: string;
    };
    tags: string[];
    args: {};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Label: Story;
export declare const LabelChecked: Story;
export declare const LabelCheckedError: Story;
export declare const LabelError: Story;
export declare const Icon: Story;
export declare const IconChecked: Story;
export declare const IconCheckedError: Story;
export declare const IconError: Story;
export declare const LongLabel: Story;
