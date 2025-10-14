import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Dropdown, DropdownProps } from "./Dropdown";

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
    disabled: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
    Label: {
      control: "text",
    },
    Layout: {
      control: "select",
      options: ["Stacked", "Side by Side"],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    Label: "Dropdown",
    Layout: "Stacked",
    data: [
      { value: "Option 1", label: "Option 1" },
      { value: "Option 2", label: "Option 2" },
      { value: "Option 3", label: "Option 3" },
      { value: "Option 4", label: "Option 4", disabled: true },
    ],
    onChange: fn(),
  },
} satisfies Meta<DropdownProps>;

export default meta;
type Story = StoryObj<DropdownProps>;

export const Default: Story = {
  args: {},
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "Option 1",
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
    value: "Option 1",
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

export const WithLeadingIcon: Story = {
  args: {
    LeadIcon: "check_badge_outline",
  },
};

export const WithIcon: Story = {
  args: {
    data: [
      { value: "Option 1", label: "Option 1", icon: "bars_3_outline" },
      { value: "Option 2", label: "Option 2", icon: "trash_outline" },
      {
        value: "Option 3",
        label: "Option 3",
        icon: "receipt_percent_outline",
      },
      {
        value: "Option 4",
        label: "Option 4",
        icon: "gift_outline",
        disabled: true,
      },
    ],
  },
};

export const LabelPlacementTop: Story = {
  args: {
    Layout: "Stacked",
  },
};

export const LabelPlacementLeft: Story = {
  args: {
    Layout: "Side by Side",
  },
};

export const LabelPlacementLeftWithError: Story = {
  args: {
    Layout: "Side by Side",
    error: "Error message",
  },
};
