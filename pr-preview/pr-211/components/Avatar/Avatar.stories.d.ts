import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Avatar').AvatarProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        variant: {
            control: {
                type: "select";
            };
            options: string[];
        };
        size: {
            control: {
                type: "select";
            };
            options: string[];
        };
        border: {
            control: {
                type: "boolean";
            };
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Primary: Story;
export declare const PrimarySmall: Story;
export declare const PrimaryLarge: Story;
export declare const PrimaryWithBorder: Story;
export declare const PrimaryWithIcon: Story;
export declare const PrimaryWithIconAndBorder: Story;
export declare const Ghost: Story;
export declare const GhostSmall: Story;
export declare const GhostLarge: Story;
export declare const GhostWithBorder: Story;
export declare const GhostWithIcon: Story;
export declare const GhostWithIconAndBorder: Story;
export declare const Image: Story;
export declare const ImageSmall: Story;
export declare const ImageLarge: Story;
export declare const ImageWithBorder: Story;
export declare const ImageWithFallback: Story;
