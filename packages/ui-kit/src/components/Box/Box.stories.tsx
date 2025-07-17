import type { Meta, StoryObj } from "@storybook/react";

import { Box } from "./Box";

const spacerOptions = [
  undefined,
  "size/spacer/0-5x",
  "size/spacer/default",
  "size/spacer/1-5x",
  "size/spacer/2x",
  "size/spacer/3x",
  "size/spacer/4x",
];
const meta = {
  title: "Box",
  component: Box,
  parameters: {},
  tags: ["autodocs"],
  args: {
    p: undefined,
    m: undefined,
    mt: undefined,
    mb: undefined,
    ml: undefined,
    mr: undefined,
    ms: undefined,
    me: undefined,
    py: undefined,
    px: undefined,
    pt: undefined,
    pb: undefined,
    ps: undefined,
    pe: undefined,
    pl: undefined,
    my: undefined,
    mx: undefined,
    pr: undefined,

    bg: "colors/scale-1/050/tone",
    children: "Container 1",
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    m: {
      control: "select",
      options: spacerOptions,
    },
    my: {
      control: "select",
      options: spacerOptions,
    },
    mx: {
      control: "select",
      options: spacerOptions,
    },
    mt: {
      control: "select",
      options: spacerOptions,
    },
    mb: {
      control: "select",
      options: spacerOptions,
    },
    ml: {
      control: "select",
      options: spacerOptions,
    },
    mr: {
      control: "select",
      options: spacerOptions,
    },
    ms: {
      control: "select",
      options: spacerOptions,
    },
    me: {
      control: "select",
      options: spacerOptions,
    },
    p: {
      control: "select",
      options: spacerOptions,
    },
    py: {
      control: "select",
      options: spacerOptions,
    },
    px: {
      control: "select",
      options: spacerOptions,
    },
    pt: {
      control: "select",
      options: spacerOptions,
    },
    pb: {
      control: "select",
      options: spacerOptions,
    },
    ps: {
      control: "select",
      options: spacerOptions,
    },
    pe: {
      control: "select",
      options: spacerOptions,
    },
    pl: {
      control: "select",
      options: spacerOptions,
    },
    pr: {
      control: "select",
      options: spacerOptions,
    },
    bw: {
      control: "number",
    },
    btw: {
      control: "number",
    },
    bbw: {
      control: "number",
    },
    brw: {
      control: "number",
    },
    blw: {
      control: "number",
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Border: Story = {
  args: {
    bw: "3px",
    bs: "solid",
    bc: "colors/scale-1/900/tone",
  },
};

export const Padding: Story = {
  args: {
    p: "size/spacer/1-5x",
  },
};

export const Margin: Story = {
  args: {
    m: "size/spacer/1-5x",
  },
};

export const BorderRadius: Story = {
  args: {
    br: "size/border-radius/1-5x",
  },
};
