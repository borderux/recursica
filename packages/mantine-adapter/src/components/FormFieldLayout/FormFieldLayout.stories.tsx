import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "@mantine/core";
import { FormFieldLayout } from "./FormFieldLayout";

const meta: Meta<typeof FormFieldLayout> = {
  title: "Components/FormFieldLayout",
  component: FormFieldLayout,
  argTypes: {
    Layout: {
      control: "select",
      options: ["Stacked", "Side-by-side"],
      description:
        "Layout orientation - Stacked (single column) or Side-by-side (2 columns with 248px label area)",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
      defaultValue: false,
    },
    Help_text: {
      control: "text",
      description: "Help text to display below the input",
      defaultValue: "This is the help text",
    },
    Error_text: {
      control: "text",
      description:
        "Error text to display below the input.  If not set, the description will be shown",
      defaultValue: "",
    },
    Show_label: {
      control: "boolean",
      description:
        "Whether to show the label.  IT will be hidden, but still be in the DOM",
      defaultValue: true,
    },
    Indicator: {
      control: "select",
      options: [
        "none",
        "optional",
        "asterisk / truncate overflow",
        "asterisk / full label text",
      ],
      description: "Indicator to display next to the label",
      defaultValue: "none",
    },
    children: {
      table: { disable: true },
    },
    LabelProps: {
      table: { disable: true },
    },
    Help_textProps: {
      table: { disable: true },
    },
    Error_textProps: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Example with TextInput
export const Default: Story = {
  args: {
    Layout: "Stacked",
    Label: "Email Address",
    Help_text: "This is a help text",
    Error_text: "",
    required: false,
    Show_label: true,
    children: <TextInput placeholder="Enter your email" />,
  },
};
