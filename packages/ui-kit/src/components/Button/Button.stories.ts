import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ForwardedButton } from "./Button";
import { IconNames } from "../Icons/Icon";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Button",
  component: ForwardedButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    leftSection: {
      control: "select",
      options: IconNames,
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof ForwardedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ContainedDefaultOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "contained",
    size: "default",
  },
};

export const ContainedDefault: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "default",
  },
};

export const ContainedDefaultNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "contained",
    size: "default",
    leftSection: "bug_report_Filled",
  },
};

export const ContainedDefaultLoading: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "default",
    loading: true,
  },
};

export const ContainedDefaultLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "contained",
    size: "default",
    loading: true,
    leftSection: "arrow_back_Outlined",
  },
};

export const ContainedDefaultDisabled: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "default",
    disabled: true,
  },
};

export const ContainedDefaultDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "contained",
    size: "default",
    disabled: true,
    leftSection: "open_in_new_Filled",
  },
};

export const ContainedDefaultLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "default",
    leftSection: "favorite_Outlined",
  },
};

export const ContainedDefaultRightIcon: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "default",
    rightSection: "person_outline_Filled",
  },
};

export const ContainedSmall: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "small",
  },
};

export const ContainedSmallOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "contained",
    size: "small",
  },
};

export const ContainedSmallNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    size: "small",
    leftSection: "keyboard_arrow_up_Filled",
  },
};

export const ContainedSmallLoading: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "small",
    loading: true,
  },
};

export const ContainedSmallLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    size: "small",
    loading: true,
    leftSection: "publish_Outlined",
  },
};

export const ContainedSmallDisabled: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "small",
    disabled: true,
  },
};

export const ContainedSmallDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    size: "small",
    disabled: true,
    leftSection: "keyboard_arrow_up_Outlined",
  },
};

export const ContainedSmallLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "small",
    leftSection: "keyboard_arrow_up_Outlined",
  },
};

export const ContainedSmallRightIcon: Story = {
  args: {
    label: "Button",
    variant: "contained",
    size: "small",
    rightSection: "person_outline_Filled",
  },
};

export const OutlinedDefault: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "default",
  },
};

export const OutlinedDefaultOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "outline",
    size: "default",
  },
};

export const OutlinedDefaultNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "default",
    leftSection: "bug_report_Filled",
  },
};

export const OutlinedDefaultLoading: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "default",
    loading: true,
  },
};

export const OutlinedDefaultLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "default",
    loading: true,
    leftSection: "cached_Filled",
  },
};

export const OutlinedDefaultDisabled: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "default",
    disabled: true,
  },
};

export const OutlinedDefaultDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "default",
    disabled: true,
    leftSection: "open_in_new_Filled",
  },
};

export const OutlinedDefaultLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "default",
    leftSection: "favorite_Outlined",
  },
};

export const OutlinedDefaultRightIcon: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "default",
    rightSection: "person_outline_Filled",
  },
};

export const OutlinedSmall: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "small",
  },
};

export const OutlinedSmallOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "outline",
    size: "small",
  },
};

export const OutlinedSmallNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "small",
    leftSection: "bug_report_Filled",
  },
};

export const OutlinedSmallLoading: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "small",
    loading: true,
  },
};

export const OutlinedSmallLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "small",
    loading: true,
    leftSection: "cached_Filled",
  },
};

export const OutlinedSmallDisabled: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "small",
    disabled: true,
  },
};

export const OutlinedSmallDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "outline",
    size: "small",
    disabled: true,
    leftSection: "open_in_new_Filled",
  },
};

export const OutlinedSmallLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "small",
    leftSection: "favorite_Outlined",
  },
};

export const OutlinedSmallRightIcon: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "small",
    rightSection: "person_outline_Filled",
  },
};

export const TextDefault: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "default",
  },
};

export const TextDefaultOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "text",
    size: "default",
  },
};

export const TextDefaultNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "default",
    leftSection: "bug_report_Filled",
  },
};

export const TextDefaultLoading: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "default",
    loading: true,
  },
};

export const TextDefaultLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "default",
    loading: true,
    leftSection: "cached_Filled",
  },
};

export const TextDefaultDisabled: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "default",
    disabled: true,
  },
};

export const TextDefaultDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "default",
    disabled: true,
    leftSection: "open_in_new_Filled",
  },
};

export const TextDefaultLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "default",
    leftSection: "favorite_Outlined",
  },
};

export const TextDefaultRightIcon: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "default",
    rightSection: "person_outline_Filled",
  },
};

export const TextSmall: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "small",
  },
};

export const TextSmallOverflow: Story = {
  args: {
    label:
      "Loren ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    variant: "text",
    size: "small",
  },
};

export const TextSmallNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "small",
    leftSection: "keyboard_arrow_up_Filled",
  },
};

export const TextSmallLoading: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "small",
    loading: true,
  },
};

export const TextSmallLoadingNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "small",
    loading: true,
    leftSection: "publish_Outlined",
  },
};

export const TextSmallDisabled: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "small",
    disabled: true,
  },
};

export const TextSmallDisabledNoLabel: Story = {
  args: {
    label: "Button",
    text: false,
    variant: "text",
    size: "small",
    disabled: true,
    leftSection: "keyboard_arrow_up_Outlined",
  },
};

export const TextSmallLeftIcon: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "small",
    leftSection: "keyboard_arrow_up_Outlined",
  },
};

export const TextSmallRightIcon: Story = {
  args: {
    label: "Button",
    variant: "text",
    size: "small",
    rightSection: "person_outline_Filled",
  },
};
