import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./Badge";

const meta = {
  title: "Badge/Counter",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeCount: Story = {
  args: {
    label: 0,
    type: "counter",
    variant: "default",
  },
};
export const BadgeCountLong: Story = {
  args: {
    label: 10000,
    type: "counter",
    variant: "primary",
  },
};
