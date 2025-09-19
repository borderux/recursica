import { StoryObj } from '@storybook/react';
import { RadioStoryComponent } from './RadioStoryComponent';
declare const meta: {
    title: string;
    component: typeof RadioStoryComponent;
    decorators: never[];
    parameters: {
        layout: string;
    };
    tags: string[];
    args: {};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const HideLabel: Story;
export declare const Default: Story;
export declare const Optional: Story;
export declare const Controlled: Story;
