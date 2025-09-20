import { StoryObj } from '@storybook/react';
declare const meta: {
    title: string;
    component: import('../../../../../node_modules/react').ForwardRefExoticComponent<import('./Box').BoxProps & import('../../../../../node_modules/react').RefAttributes<HTMLDivElement>>;
    parameters: {};
    tags: string[];
    args: {
        p: undefined;
        m: undefined;
        mt: undefined;
        mb: undefined;
        ml: undefined;
        mr: undefined;
        ms: undefined;
        me: undefined;
        py: undefined;
        px: undefined;
        pt: undefined;
        pb: undefined;
        ps: undefined;
        pe: undefined;
        pl: undefined;
        my: undefined;
        mx: undefined;
        pr: undefined;
        bg: "colors/scale-1/050/tone";
        children: string;
    };
    argTypes: {
        children: {
            table: {
                disable: true;
            };
        };
        m: {
            control: "select";
            options: (string | undefined)[];
        };
        my: {
            control: "select";
            options: (string | undefined)[];
        };
        mx: {
            control: "select";
            options: (string | undefined)[];
        };
        mt: {
            control: "select";
            options: (string | undefined)[];
        };
        mb: {
            control: "select";
            options: (string | undefined)[];
        };
        ml: {
            control: "select";
            options: (string | undefined)[];
        };
        mr: {
            control: "select";
            options: (string | undefined)[];
        };
        ms: {
            control: "select";
            options: (string | undefined)[];
        };
        me: {
            control: "select";
            options: (string | undefined)[];
        };
        p: {
            control: "select";
            options: (string | undefined)[];
        };
        py: {
            control: "select";
            options: (string | undefined)[];
        };
        px: {
            control: "select";
            options: (string | undefined)[];
        };
        pt: {
            control: "select";
            options: (string | undefined)[];
        };
        pb: {
            control: "select";
            options: (string | undefined)[];
        };
        ps: {
            control: "select";
            options: (string | undefined)[];
        };
        pe: {
            control: "select";
            options: (string | undefined)[];
        };
        pl: {
            control: "select";
            options: (string | undefined)[];
        };
        pr: {
            control: "select";
            options: (string | undefined)[];
        };
        bw: {
            control: "number";
        };
        btw: {
            control: "number";
        };
        bbw: {
            control: "number";
        };
        brw: {
            control: "number";
        };
        blw: {
            control: "number";
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Border: Story;
export declare const Padding: Story;
export declare const Margin: Story;
export declare const BorderRadius: Story;
