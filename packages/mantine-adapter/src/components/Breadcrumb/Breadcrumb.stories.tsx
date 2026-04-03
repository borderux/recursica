import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { Layer } from "@recursica/adapter-common";
import { Anchor } from "@mantine/core";

type BreadcrumbStoryProps = React.ComponentProps<typeof Breadcrumb> & {
  layer?: number;
};

const meta: Meta<BreadcrumbStoryProps> = {
  title: "UI-Kit/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  argTypes: {
    overStyled: {
      control: "boolean",
      description: "Allow generic external styles to override base kit limits",
    },
    layer: {
      control: "radio",
      options: [0, 1, 2, 3],
      description: "The design system layer context",
      table: {
        category: "Story Controls",
      },
    },
    separator: {
      control: "text",
      description: "Custom separator between items",
    },
  },
};

export default meta;

type Story = StoryObj<BreadcrumbStoryProps>;

const mockItems = [
  { title: "Home", href: "#" },
  { title: "Components", href: "#" },
  { title: "Breadcrumb", href: "#" },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export const Default: Story = {
  args: {
    children: mockItems,
    overStyled: false,
    layer: 0,
  },
  render: ({ layer = 0, ...args }) => {
    return (
      <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "24px" }}>
        <Breadcrumb {...(args as React.ComponentProps<typeof Breadcrumb>)} />
      </Layer>
    );
  },
};

export const StaticExample: Story = {
  args: {
    children: mockItems,
  },
  render: (args: BreadcrumbStoryProps) => <Breadcrumb {...args} />,
};

export const CustomSeparator: Story = {
  args: {
    children: mockItems,
    separator: "→",
  },
  render: (args: BreadcrumbStoryProps) => <Breadcrumb {...args} />,
};
