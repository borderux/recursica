/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";
import { Text } from "../Text/Text";

const meta: Meta<typeof Link> = {
  title: "UI-Kit/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: ["children", "href", "icon", "component", "onClick"],
    },
  },
  args: {
    children: "Link text",
    href: "#",
  },
  render: ({ withLayer, layer, ...args }: any) => <Link {...args} />,
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
    ),
    children: "Link with Icon",
  },
};

export const Polymorphic: Story = {
  args: {
    component: "button",
    onClick: () => alert("Button clicked!"),
    children: "Rendered as <button>",
  },
};

export const InlineText: Story = {
  render: () => (
    <Text>
      Here is some text with an <Link href="#">inline link</Link> inside it.
    </Text>
  ),
};
