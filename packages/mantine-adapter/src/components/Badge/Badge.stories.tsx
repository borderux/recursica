import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { Layer } from "@recursica/adapter-common";

type BadgeStoryProps = React.ComponentProps<typeof Badge>;

const meta: Meta<BadgeStoryProps> = {
  title: "UI-Kit/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["alert", "primary-color", "success", "warning"],
      description: "The style / intent mapping for the badge",
    },
  },
};

export default meta;

type Story = StoryObj<BadgeStoryProps>;

export const Default: Story = {
  args: {
    children: "Badge Label",
    variant: "primary-color",
  },
  render: (args) => {
    return <Badge {...args} />;
  },
};

export const StaticAlert: Story = {
  args: {
    children: "Alert Badge",
    variant: "alert",
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />,
};

export const StaticPrimary: Story = {
  args: {
    children: "Primary Badge",
    variant: "primary-color",
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />,
};

export const StaticSuccess: Story = {
  args: {
    children: "Success Badge",
    variant: "success",
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />,
};

export const StaticWarning: Story = {
  args: {
    children: "Warning Badge",
    variant: "warning",
  },
  render: (args: BadgeStoryProps) => <Badge {...args} />,
};

export const LayerOneAlert: Story = {
  args: {
    children: "Layer 1 Alert",
    variant: "alert",
  },
  render: (args: BadgeStoryProps) => (
    <Layer layer={1} style={{ padding: "24px" }}>
      <Badge {...args} />
    </Layer>
  ),
};
