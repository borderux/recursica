import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonProps } from "./Button";
import { IconNames } from "../Icons/Icon";
import { fn } from "storybook/test";

// Get some common icon names for the select options

const meta: Meta<typeof Button> = {
  title: "UI Kit/Button",
  component: Button,
  argTypes: {
    Style: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
      description: "The style of the button",
    },
    Size: {
      control: { type: "select" },
      options: ["default", "small"],
      description: "The size of the button",
    },
    Disabled: {
      control: { type: "boolean" },
      description: "The disabled state of the button",
    },
    Content: {
      control: { type: "select" },
      options: ["Icon", "Text", "IconText"],
      description: "The content of the button",
    },
    Loading: {
      control: { type: "boolean" },
      description: "The loading state of the button",
    },
    Label: {
      control: { type: "text" },
      description: "The label of the button",
    },
    Icon: {
      control: { type: "select" },
      options: IconNames,
      description: "The icon for icon variant",
      if: { arg: "Content", eq: "Icon" },
    },
    LeadingIcon: {
      control: { type: "select" },
      options: IconNames,
      description: "The leading icon for iconText variant",
      if: { arg: "Content", eq: "IconText" },
    },
    TrailingIcon: {
      control: { type: "select" },
      options: IconNames,
      description: "The trailing icon for iconText variant",
      if: { arg: "Content", neq: "Icon" },
    },
  },
  parameters: {
    layout: "centered",
    controls: {
      include: [
        "Style",
        "Content",
        "Size",
        "Disabled",
        "Loading",
        "Label",
        "LeadingIcon",
        "TrailingIcon",
        "Icon",
      ],
    },
  },
  args: {
    onClick: fn(),
    TrailingIcon: undefined,
    LeadingIcon: "archive_box_solid",
    Icon: "academic_cap_outline",
    Style: "solid",
    Size: "default",
    Disabled: false,
    Loading: false,
    Label: "Button",
    Content: "Text",
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  name: "Button",
  args: {},
};
