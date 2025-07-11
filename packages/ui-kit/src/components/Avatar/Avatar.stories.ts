import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "./Avatar";

const meta = {
  title: "Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "ghost", "image"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "default", "large"],
    },
    border: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variant stories
export const Primary: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    size: "default",
  },
};

export const PrimarySmall: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    size: "small",
  },
};

export const PrimaryLarge: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    size: "large",
  },
};

export const PrimaryWithBorder: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    size: "default",
    border: true,
  },
};

export const PrimaryWithIcon: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    icon: "person_outline_Filled",
    size: "default",
  },
};

export const PrimaryWithIconAndBorder: Story = {
  args: {
    initials: "JD",
    variant: "primary",
    icon: "person_outline_Filled",
    size: "default",
    border: true,
  },
};

// Ghost variant stories
export const Ghost: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default",
  },
};

export const GhostSmall: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    size: "small",
  },
};

export const GhostLarge: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    size: "large",
  },
};

export const GhostWithBorder: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default",
    border: true,
  },
};

export const GhostWithIcon: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    icon: "person_outline_Filled",
    size: "default",
  },
};

export const GhostWithIconAndBorder: Story = {
  args: {
    initials: "JD",
    variant: "ghost",
    icon: "person_outline_Filled",
    size: "default",
    border: true,
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

export const ImageWithBorder: Story = {
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "default",
    border: true,
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
