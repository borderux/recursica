import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { IconNames } from "../Icons/Icon";

// Get some common icon names for the select options

const meta: Meta<typeof Button> = {
  title: "UI Kit/Button",
  component: Button,

  argTypes: {
    Style: {
      control: { type: "select" },
      options: ["solid", "outline", "text"],
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
    Loading: {
      control: { type: "boolean" },
      description: "The loading state of the button",
    },
    Label: {
      control: { type: "text" },
      description: "The label of the button",
    },
    LeadingIcon: {
      control: { type: "select" },
      options: IconNames,
      description: "The leading icon for iconText variant",
    },
    TrailingIcon: {
      control: { type: "select" },
      options: IconNames,
      description: "The trailing icon for iconText variant",
    },
  },
  parameters: {
    controls: {
      include: [
        "Style",
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Style: "solid",
    Size: "default",
    Disabled: false,
    Loading: false,
    Label: "Button",
    LeadingIcon: undefined,
    TrailingIcon: undefined,
    Icon: undefined,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    Style: "solid",
    Size: "default",
    Disabled: false,
    Loading: false,
    Label: "Download",
    LeadingIcon: "arrow_down_outline",
    TrailingIcon: undefined,
    Icon: undefined,
  },
};

export const WithTrailingIcon: Story = {
  args: {
    Style: "outline",
    Size: "default",
    Disabled: false,
    Loading: false,
    Label: "Next",
    LeadingIcon: undefined,
    TrailingIcon: "arrow_right_outline",
    Icon: undefined,
  },
};

export const IconOnly: Story = {
  args: {
    Style: "text",
    Size: "default",
    Disabled: false,
    Loading: false,
    Label: "Settings",
    LeadingIcon: undefined,
    TrailingIcon: undefined,
    Icon: "",
  },
};

export const Loading: Story = {
  args: {
    Style: "solid",
    Size: "default",
    Disabled: false,
    Loading: true,
    Label: "Saving...",
    LeadingIcon: undefined,
    TrailingIcon: undefined,
    Icon: undefined,
  },
};

export const Disabled: Story = {
  args: {
    Style: "solid",
    Size: "default",
    Disabled: true,
    Loading: false,
    Label: "Disabled Button",
    LeadingIcon: undefined,
    TrailingIcon: undefined,
    Icon: undefined,
  },
};
