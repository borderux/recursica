import type { Meta, StoryObj } from "@storybook/react";
import { ErrorText } from "./ErrorText";

const meta: Meta<typeof ErrorText> = {
  title: "Components/_Base/ErrorText",
  component: ErrorText,
  argTypes: {
    Text: {
      control: "text",
      description: "The error text content",
    },
    Has_icon: {
      control: "boolean",
      description: "Whether to show an icon",
    },
    Icon: {
      control: "text",
      description: "Icon content (when Has_icon is true)",
    },
    useInputError: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic error text
export const Default: Story = {
  args: {
    Text: "This field is required",
    useInputError: true,
  },
};
