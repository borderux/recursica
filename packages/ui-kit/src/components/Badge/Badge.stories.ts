import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./Badge";

const meta = {
  title: "Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["default", "large"],
    },
    style: {
      control: { type: "select" },
      options: ["primary", "ghost", "alert", "success"],
    },
  },
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default size stories
export const Primary: Story = {
  args: {
    label: "Badge",
    size: "default",
    style: "primary",
  },
};

export const Ghost: Story = {
  args: {
    label: "Badge",
    size: "default",
    style: "ghost",
  },
};

export const Alert: Story = {
  args: {
    label: "Badge",
    size: "default",
    style: "alert",
  },
};

export const Success: Story = {
  args: {
    label: "Badge",
    size: "default",
    style: "success",
  },
};

// Large size stories
export const PrimaryLarge: Story = {
  args: {
    label: "Badge",
    size: "large",
    style: "primary",
  },
};

export const GhostLarge: Story = {
  args: {
    label: "Badge",
    size: "large",
    style: "ghost",
  },
};

export const AlertLarge: Story = {
  args: {
    label: "Badge",
    size: "large",
    style: "alert",
  },
};

export const SuccessLarge: Story = {
  args: {
    label: "Badge",
    size: "large",
    style: "success",
  },
};
