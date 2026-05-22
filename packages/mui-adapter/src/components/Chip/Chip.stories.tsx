import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

type ChipStoryProps = React.ComponentProps<typeof Chip>;

const meta: Meta<ChipStoryProps> = {
  title: "UI-Kit/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Chip component is used to represent interactive selections, descriptive tags, or dynamic filters natively bounded to Recursica variables. It can be used as a toggleable input, can render a custom leading `icon`, and handles close constraints automatically via the `onRemove` property.",
      },
    },
  },
  argTypes: {
    error: {
      control: "boolean",
      description: "Applies the error state styling dynamically.",
    },
    disabled: {
      control: "boolean",
      description: "Applies disabled token states.",
    },
    checked: {
      control: "boolean",
      description: "Forces the visual selected state.",
    },
  },
};

export default meta;

type Story = StoryObj<ChipStoryProps>;

// The Default story exposing native properties for the playground.
export const Default: Story = {
  args: {
    children: "Default Chip",
    error: false,
    disabled: false,
    checked: false,
  },
  render: (args: ChipStoryProps) => <Chip {...args} />,
};

// Static Stories for Regression Snapshots
export const Unselected: Story = {
  args: {
    children: "Unselected",
    checked: false,
  },
  render: (args: ChipStoryProps) => <Chip {...args} />,
};

export const Selected: Story = {
  args: {
    children: "Selected",
    checked: true,
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />,
};

export const ErrorState: Story = {
  args: {
    children: "Error",
    error: true,
    checked: false,
  },
  render: (args: ChipStoryProps) => <Chip {...args} />,
};

export const ErrorSelected: Story = {
  args: {
    children: "Error Selected",
    error: true,
    checked: true,
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />,
};

export const Removable: Story = {
  args: {
    children: "Dismissible",
    checked: false,
    onRemove: () => console.log("Removal Action Triggered"),
  },
  render: (args: ChipStoryProps) => <Chip {...args} />,
};

export const WithLeadingIcon: Story = {
  args: {
    children: "Leading Icon",
    checked: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
      </svg>
    ),
  },
  render: (args: ChipStoryProps) => <Chip {...args} />,
};
