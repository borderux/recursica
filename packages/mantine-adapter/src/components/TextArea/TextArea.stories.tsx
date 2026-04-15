import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

type TextAreaStoryProps = React.ComponentProps<typeof TextArea>;

const meta: Meta<TextAreaStoryProps> = {
  title: "UI-Kit/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "TextArea provides a multi-line input field, mapping layout explicitly over the standardized FormControlWrapper.",
      },
    },
  },
  args: {
    label: "Description",
    assistiveText: "Enter your full description here.",
    disabled: false,
    required: false,
    readOnly: false,
    autosize: false,
  },
  argTypes: {
    ...formControlArgTypes,
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    autosize: {
      control: "boolean",
    },
    minRows: {
      control: "number",
    },
    maxRows: {
      control: "number",
    },
    value: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<TextAreaStoryProps>;

export const Default: Story = {
  args: {
    placeholder: "Type something long...",
  },
};

export const Autosize: Story = {
  args: {
    label: "Auto-sizing TextArea",
    autosize: true,
    minRows: 2,
    maxRows: 6,
    placeholder: "Type multiple lines here. Watch it grow!",
  },
};

export const StaticError: Story = {
  args: {
    error: "This field requires a detailed explanation.",
    value: "Some bad input.",
  },
};

export const StaticDisabled: Story = {
  args: {
    disabled: true,
    value: "This content is locked.",
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "Read Only View",
    readOnly: true,
    value: "This text is safely frozen in read-only form.",
  },
};
