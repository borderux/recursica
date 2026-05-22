import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { Layer } from "@recursica/adapter-common";

type AvatarStoryProps = React.ComponentProps<typeof Avatar>;

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
    icon: {
      table: {
        disable: true,
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
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => {
    return <Avatar {...args} />;
  },
};

export const TextSolidDefault: Story = {
  args: {
    children: "JD",
    variant: "solid",
    size: "default",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Avatar {...args} />,
};

export const ImageLarge: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    size: "large",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Avatar {...args} />,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Avatar {...args} />,
};

export const LayerOneOutline: Story = {
  args: {
    children: "L1",
    variant: "outline",
    size: "default",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Layer layer={1} style={{ padding: "24px", display: "inline-block" }}>
      <Avatar {...args} />
    </Layer>
  ),
};
