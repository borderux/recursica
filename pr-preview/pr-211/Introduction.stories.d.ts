import { Meta, StoryObj } from '@storybook/react';
declare const WelcomeComponent: () => import("react/jsx-runtime").JSX.Element;
declare const meta: Meta<typeof WelcomeComponent>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Welcome: Story;
