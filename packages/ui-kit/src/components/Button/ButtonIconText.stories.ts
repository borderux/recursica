import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ForwardedButton } from "./Button";

const meta = {
  title: "Button/IconText",
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
    leading: {
      control: { type: "select" },
      options: [
        "home_outline",
        "heart_outline",
        "star_outline",
        "user_outline",
      ],
    },
    trailing: {
      control: { type: "select" },
      options: ["arrow_right_outline", "chevron_right_outline", "plus_outline"],
    },
  },
  args: {
    onClick: fn(),
    label: "Button",
    leading: "home_outline",
    trailing: "arrow_right_outline",
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
    leading: "heart_outline",
    trailing: "chevron_right_outline",
  },
};

export const OutlineSmall: Story = {
  args: {
    variant: "outline",
    leading: "heart_outline",
    trailing: "chevron_right_outline",
    size: "small",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    leading: "star_outline",
    trailing: "plus_outline",
  },
};

export const TextSmall: Story = {
  args: {
    variant: "text",
    leading: "star_outline",
    trailing: "plus_outline",
    size: "small",
  },
};

export const LeadingOnly: Story = {
  args: {
    variant: "solid",
    trailing: undefined,
  },
};

export const LeadingOnlySmall: Story = {
  args: {
    variant: "solid",
    trailing: undefined,
    size: "small",
  },
};

export const TrailingOnly: Story = {
  args: {
    variant: "solid",
    leading: undefined,
  },
};

export const TrailingOnlySmall: Story = {
  args: {
    variant: "solid",
    leading: undefined,
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
