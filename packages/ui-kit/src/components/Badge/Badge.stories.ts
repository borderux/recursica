import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./Badge";

const meta = {
  title: "Badge/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeDefault: Story = {
  args: {
    label: "Badge",
    type: "status",
    variant: "default",
  },
};

export const BadgePrimary: Story = {
  args: {
    label: "Badge",
    type: "status",
    variant: "primary",
  },
};

export const BadgeAlert: Story = {
  args: {
    label: "Badge",
    type: "status",
    variant: "alert",
  },
};

export const BadgeSuccess: Story = {
  args: {
    label: "Badge",
    type: "status",
    variant: "success",
  },
};
