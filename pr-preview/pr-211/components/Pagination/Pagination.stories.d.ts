import { StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';
declare const meta: {
    title: string;
    component: typeof Pagination;
    parameters: {
        layout: string;
    };
    tags: string[];
    args: {};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const FivePages: Story;
export declare const ThreePages: Story;
export declare const TwentyPages: Story;
