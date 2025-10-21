import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "@mantine/core";
import { FormFieldLayout } from "./FormFieldLayout";
import { formFieldLayoutArgTypes } from "./FormFieldLayout.stories.helper";

const meta: Meta<typeof FormFieldLayout> = {
  title: "Components/FormFieldLayout",
  component: FormFieldLayout,
  argTypes: formFieldLayoutArgTypes,
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
