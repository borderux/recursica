import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "./Avatar";

const meta = {
  title: "Example/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["text", "icon", "image"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "default", "large"],
    },
    outline: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Text variant stories
export const Text: Story = {
  args: {
    initials: "JD",
    variant: "text",
    size: "default",
  },
};

export const TextSmall: Story = {
  args: {
    initials: "JD",
    variant: "text",
    size: "small",
  },
};

export const TextLarge: Story = {
  args: {
    initials: "JD",
    variant: "text",
    size: "large",
  },
};

export const TextOutline: Story = {
  args: {
    initials: "JD",
    variant: "text",
    size: "default",
    outline: true,
  },
};

// Icon variant stories
export const Icon: Story = {
  args: {
    initials: "JD",
    variant: "icon",
    icon: "person_outline_Filled",
    size: "default",
  },
};

export const IconSmall: Story = {
  args: {
    initials: "JD",
    variant: "icon",
    icon: "person_outline_Filled",
    size: "small",
  },
};

export const IconLarge: Story = {
  args: {
    initials: "JD",
    variant: "icon",
    icon: "person_outline_Filled",
    size: "large",
  },
};

export const IconOutline: Story = {
  args: {
    initials: "JD",
    variant: "icon",
    icon: "person_outline_Filled",
    size: "default",
    outline: true,
  },
};

// Image variant stories
export const Image: Story = {
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "default",
  },
};

export const ImageSmall: Story = {
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "small",
  },
};

export const ImageLarge: Story = {
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "large",
  },
};

// Fallback to initials when image fails to load
export const ImageWithFallback: Story = {
  args: {
    initials: "JD",
    variant: "image",
    src: "https://invalid-url-that-will-fail.com/image.jpg",
    alt: "John Doe",
    size: "default",
  },
};
