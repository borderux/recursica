import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { Layer } from "@recursica/adapter-common";

type AvatarStoryProps = React.ComponentProps<typeof Avatar> & {
  layer?: number;
};

const meta: Meta<AvatarStoryProps> = {
  title: "UI-Kit/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost"],
      description:
        "The visual variant of the avatar (applies to icon/text styles)",
    },
    size: {
      control: "radio",
      options: ["default", "small", "large"],
      description: "The size of the avatar",
    },
    src: {
      control: "text",
      description: "Image URL for the image style avatar",
    },
    layer: {
      control: "radio",
      options: [0, 1, 2, 3],
      description: "The design system layer context",
      table: {
        category: "Story Controls",
      },
    },
  },
};

export default meta;

type Story = StoryObj<AvatarStoryProps>;

export const Default: Story = {
  args: {
    size: "default",
    variant: "solid",
    layer: 0,
    children: "AB",
  },
  render: ({ layer = 0, ...args }) => {
    return (
      <Layer
        layer={layer as 0 | 1 | 2 | 3}
        style={{ padding: "24px", display: "inline-block" }}
      >
        <Avatar {...args} />
      </Layer>
    );
  },
};

export const TextSolidDefault: Story = {
  args: {
    children: "JD",
    variant: "solid",
    size: "default",
  },
  render: (args) => <Avatar {...args} />,
};

export const ImageLarge: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    size: "large",
  },
  render: (args) => <Avatar {...args} />,
};

export const IconSmallGhost: Story = {
  args: {
    size: "small",
    variant: "ghost",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  render: (args) => <Avatar {...args} />,
};

export const LayerOneOutline: Story = {
  args: {
    children: "L1",
    variant: "outline",
    size: "default",
  },
  render: (args) => (
    <Layer layer={1} style={{ padding: "24px", display: "inline-block" }}>
      <Avatar {...args} />
    </Layer>
  ),
};
