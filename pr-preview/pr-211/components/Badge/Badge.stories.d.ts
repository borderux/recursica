import { StoryObj } from '@storybook/react';
import { Badge } from './Badge';
declare const meta: {
    title: string;
    component: typeof Badge;
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
        style: {
            control: {
                type: "select";
            };
            options: string[];
        };
    };
    args: {};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Primary: Story;
export declare const Ghost: Story;
export declare const Alert: Story;
export declare const Success: Story;
export declare const PrimaryLarge: Story;
export declare const GhostLarge: Story;
export declare const AlertLarge: Story;
export declare const SuccessLarge: Story;
