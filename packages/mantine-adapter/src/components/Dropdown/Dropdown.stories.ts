import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Dropdown, type DropdownProps } from "./Dropdown";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "UI Kit/Dropdown",
  component: Dropdown,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  argTypes: {
    onChange: {
      table: {
        disable: true,
      },
    },
    data: {
      table: {
        disable: true,
      },
    },
    placeholder: {
      control: "text",
    },
    Disabled: {
      control: "boolean",
    },
    Error: {
      control: "text",
    },
    Label: {
      control: "text",
    },
    Layout: {
      control: "select",
      options: ["Stacked", "Side by Side"],
    },
    Content: {
      control: "select",
      options: ["Value", "Multiple values"],
    },
  },
  args: {
    Label: "Dropdown",
    Layout: "Stacked",
    Content: "Value",
    data: [
      { value: "Option 1", label: "Option 1" },
      { value: "Option 2", label: "Option 2" },
      {
        value: "Option 3",
        label: "Option 3",
        icon: "arrow_turn_down_right_outline",
      },
      { value: "Option 4", label: "Option 4", disabled: true },
    ],
    onChange: fn(),
  },
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {
  name: "Dropdown",
  args: {},
};
