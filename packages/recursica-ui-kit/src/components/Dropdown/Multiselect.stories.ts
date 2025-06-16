import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { Multiselect } from "./Multiselect";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Multiselect",
  component: Multiselect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
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
    disabled: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    label: {
      control: "text",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
    label: "Multiselect",
    data: [
      { value: "Option 1", label: "Option 1" },
      { value: "Option 2", label: "Option 2" },
      { value: "Option 3", label: "Option 3" },
      { value: "Option 4", label: "Option 4", disabled: true },
    ],
  },
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: ["Option 1"],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const SelectedDisabled: Story = {
  args: {
    disabled: true,
    value: ["Option 1"],
  },
};

export const Error: Story = {
  args: {
    error: "Error message",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Select an option",
  },
};

export const NoLabel: Story = {
  args: {
    showLabel: false,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: "publish_Outlined",
  },
};

export const Optional: Story = {
  args: {
    isOptional: true,
  },
};

export const WithIcon: Story = {
  args: {
    data: [
      { value: "Option 1", label: "Option 1", icon: "envelope_outline" },
      { value: "Option 2", label: "Option 2", icon: "archive_box_outline" },
      {
        value: "Option 3",
        label: "Option 3",
        icon: "chat_bubble_left_ellipsis_outline",
      },
      {
        value: "Option 4",
        label: "Option 4",
        icon: "home_outline",
        disabled: true,
      },
    ],
  },
};
