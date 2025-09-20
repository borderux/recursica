import { StoryObj } from '@storybook/react';
import { CheckboxStoryComponent } from './CheckboxStoryComponent';
declare const meta: {
    title: string;
    component: typeof CheckboxStoryComponent;
    decorators: never[];
    parameters: {
        layout: string;
    };
    tags: string[];
    args: {};
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Optional: Story;
export declare const Controlled: Story;
export declare const NoLabel: Story;
export declare const LabelOnLeft: Story;
