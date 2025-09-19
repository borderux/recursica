import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Breadcrumb').BreadcrumbProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const TextOnly: Story;
export declare const WithIcons: Story;
export declare const IconOnly: Story;
export declare const MixedContent: Story;
export declare const LongPath: Story;
