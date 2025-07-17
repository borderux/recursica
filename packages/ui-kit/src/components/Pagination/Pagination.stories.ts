import type { Meta, StoryObj } from "@storybook/react";

import { Pagination } from "./Pagination";

const meta = {
  title: "Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    total: 10,
  },
};

export const FivePages: Story = {
  args: {
    total: 5,
  },
};

export const ThreePages: Story = {
  args: {
    total: 3,
  },
};

export const TwentyPages: Story = {
  args: {
    total: 20,
  },
};
