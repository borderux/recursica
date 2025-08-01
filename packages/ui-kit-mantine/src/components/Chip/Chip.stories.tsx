import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const meta = {
  title: "Chip/Standalone",
  component: Chip,
  decorators: [],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  args: {
    label: "Chip",
  },
};

export const LabelChecked: Story = {
  args: {
    label: "Chip",
    checked: true,
  },
};

export const LabelCheckedError: Story = {
  args: {
    label: "Chip",
    checked: true,
    error: true,
  },
};
export const LabelError: Story = {
  args: {
    label: "Chip",
    error: true,
  },
};

export const Icon: Story = {
  args: {
    label: "Chip",
    icon: {
      unselected: "heart_outline",
      selected: "heart_solid",
    },
  },
};

export const IconChecked: Story = {
  args: {
    label: "Chip",
    icon: {
      unselected: "heart_outline",
      selected: "heart_solid",
    },
    checked: true,
  },
};

export const IconCheckedError: Story = {
  args: {
    label: "Chip",
    icon: {
      unselected: "heart_outline",
      selected: "heart_solid",
    },
    checked: true,
    error: true,
  },
};

export const IconError: Story = {
  args: {
    label: "Chip",
    icon: {
      unselected: "heart_outline",
      selected: "heart_solid",
    },
    error: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: "Long long long long long long label",
  },
};
