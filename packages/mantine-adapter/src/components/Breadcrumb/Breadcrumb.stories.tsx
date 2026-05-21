import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { Link } from "../Link";

type BreadcrumbStoryProps = React.ComponentProps<typeof Breadcrumb> & {
  items?: string[];
};

const meta: Meta<BreadcrumbStoryProps> = {
  title: "UI-Kit/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    items: {
      control: "object",
      description:
        "Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",
      table: {
        category: "Story Controls",
      },
    },
    separator: {
      control: "text",
      description: "Custom separator between items",
    },
  },
  args: {
    items: ["Home", "Components", "Breadcrumbs"],
  },
  render: ({ items, children, ...args }) => {
    const mappedChildren = items
      ? items.map((label, index) => (
          <Link href="#" key={index}>
            {label}
          </Link>
        ))
      : children;

    return <Breadcrumb children={mappedChildren} {...args} />;
  },
};

export default meta;

type Story = StoryObj<BreadcrumbStoryProps>;

export const Default: Story = {
  args: {
    items: ["Dashboard", "Settings", "Security"],
  },
};

export const StaticExample: Story = {
  args: {
    items: ["Store", "Electronics", "Computers", "Laptops"],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→",
  },
};
