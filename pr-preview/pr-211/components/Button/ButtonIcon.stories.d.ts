import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Button').ButtonProps & import('../../../../../node_modules/react').RefAttributes<HTMLButtonElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        size: {
            control: {
                type: "select";
            };
            options: string[];
        };
        icon: {
            control: {
                type: "select";
            };
            options: string[];
        };
    };
    args: {
        onClick: import('vitest').Mock<(...args: any[]) => any>;
        label: string;
        icon: "heart_outline";
        size: "default";
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Solid: Story;
export declare const SolidSmall: Story;
export declare const Outline: Story;
export declare const OutlineSmall: Story;
export declare const Text: Story;
export declare const TextSmall: Story;
export declare const Loading: Story;
export declare const LoadingSmall: Story;
export declare const Disabled: Story;
export declare const DisabledSmall: Story;
