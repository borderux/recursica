import type { Meta, StoryObj } from "@storybook/react";

import { Flex } from "./Flex";

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
  title: "Flex",
  component: Flex,
  parameters: {},
  tags: ["autodocs"],
  args: {
    gap: undefined,
    rowGap: undefined,
    columnGap: undefined,
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
    children: (
      <>
        <div
          style={{
            backgroundColor: "#E6F2EF",
            width: "100px",
            height: "100px",
          }}
        >
          Child 1
        </div>
        <div
          style={{
            backgroundColor: "#E6F2EF",
            width: "100px",
            height: "100px",
          }}
        >
          Child 2
        </div>
      </>
    ),
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    gap: {
      control: "select",
      options: spacerOptions,
    },
    rowGap: {
      control: "select",
      options: spacerOptions,
    },
    columnGap: {
      control: "select",
      options: spacerOptions,
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
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: "size/spacer/default",
  },
};

export const size0_5x: Story = {
  args: {
    gap: "size/spacer/0-5x",
  },
};

export const size1_5x: Story = {
  args: {
    gap: "size/spacer/1-5x",
  },
};

export const size2x: Story = {
  args: {
    gap: "size/spacer/2x",
  },
};

export const size3x: Story = {
  args: {
    gap: "size/spacer/3x",
  },
};

export const size4x: Story = {
  args: {
    gap: "size/spacer/4x",
  },
};
