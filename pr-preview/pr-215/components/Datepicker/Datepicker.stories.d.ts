import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Datepicker').DatePickerInputProps & import('../../../../../node_modules/react').RefAttributes<HTMLButtonElement>>;
    parameters: {};
    tags: string[];
    args: {
        label: string;
        onChange: import('vitest').Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
