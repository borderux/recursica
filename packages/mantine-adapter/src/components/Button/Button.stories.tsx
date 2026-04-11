import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Layer } from "@recursica/adapter-common";

type ButtonStoryProps = React.ComponentProps<typeof Button>;

const meta: Meta<ButtonStoryProps> = {
  title: "UI-Kit/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "text"],
      description: "The visual variant of the button",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<ButtonStoryProps>;

export const Default: Story = {
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false,
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const SolidDefault: Story = {
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default",
  },
};

export const OutlineSmall: Story = {
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small",
  },
};

export const TextWithIcon: Story = {
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
  },
};

export const LayerOneSolid: Story = {
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default",
  },
  render: (args: ButtonStoryProps) => (
    <Layer layer={1} style={{ padding: "24px" }}>
      <Button {...args} />
    </Layer>
  ),
};

export const DisabledSolid: Story = {
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true,
  },
};
