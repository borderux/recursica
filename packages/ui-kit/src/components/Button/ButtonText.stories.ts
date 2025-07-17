import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ForwardedButton } from "./Button";

const meta = {
  title: "Button/Text",
  component: ForwardedButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["default", "small"],
    },
  },
  args: {
    onClick: fn(),
    label: "Button",
    size: "default",
  },
} satisfies Meta<typeof ForwardedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    variant: "solid",
  },
};

export const SolidSmall: Story = {
  args: {
    variant: "solid",
    size: "small",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const OutlineSmall: Story = {
  args: {
    variant: "outline",
    size: "small",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const TextSmall: Story = {
  args: {
    variant: "text",
    size: "small",
  },
};

export const Loading: Story = {
  args: {
    variant: "solid",
    loading: true,
  },
};

export const LoadingSmall: Story = {
  args: {
    variant: "solid",
    size: "small",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: "solid",
    disabled: true,
  },
};

export const DisabledSmall: Story = {
  args: {
    variant: "solid",
    size: "small",
    disabled: true,
  },
};
