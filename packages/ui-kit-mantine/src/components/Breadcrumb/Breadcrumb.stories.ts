import type { Meta, StoryObj } from "@storybook/react";

import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnly: Story = {
  args: {
    items: [
      { text: "Home", href: "/" },
      { text: "Products", href: "/products" },
      { text: "Electronics" },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { text: "Home", icon: "home_outline", href: "/" },
      { text: "Products", icon: "shopping_bag_outline", href: "/products" },
      { text: "Electronics" },
    ],
  },
};

export const IconOnly: Story = {
  args: {
    items: [
      { icon: "home_outline", href: "/" },
      { icon: "folder_outline", href: "/documents" },
      { icon: "document_outline" },
    ],
  },
};

export const MixedContent: Story = {
  args: {
    items: [
      { text: "Home", href: "/" },
      { icon: "folder_outline", href: "/documents" },
      {
        text: "Reports",
        icon: "document_outline",
        href: "/documents/reports",
      },
      { text: "Q4 2023" },
    ],
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { text: "Home", href: "/" },
      { text: "Admin", href: "/admin" },
      { text: "Users", href: "/admin/users" },
      { text: "User Management", href: "/admin/users/management" },
      { text: "John Doe", href: "/admin/users/management/john-doe" },
      { text: "Profile" },
    ],
  },
};
