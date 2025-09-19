import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: ({ label, position, children, opened, }: import('./Tooltip').TooltipProps) => import("react/jsx-runtime").JSX.Element;
    parameters: {
        layout: string;
    };
    argTypes: {
        position: {
            control: "select";
            options: string[];
        };
        children: {
            table: {
                disable: true;
            };
        };
    };
    tags: string[];
    args: {
        children: import("react/jsx-runtime").JSX.Element;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Overflow: Story;
export declare const Top: Story;
export declare const TopStart: Story;
export declare const TopEnd: Story;
export declare const Bottom: Story;
export declare const BottomStart: Story;
export declare const BottomEnd: Story;
export declare const Left: Story;
export declare const LeftStart: Story;
export declare const LeftEnd: Story;
export declare const Right: Story;
export declare const RightStart: Story;
export declare const RightEnd: Story;
