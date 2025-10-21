import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { formFieldLayoutArgTypes } from "../FormFieldLayout/FormFieldLayout.stories.helper";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
  argTypes: formFieldLayoutArgTypes,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Label: "File Input",
    State: "Enabled",
    Upload_icon: true,
    Clear_icon: true,
    Help_text: "Help text",
    Error_text: "",
    required: false,
    disabled: false,
    placeholder: "Select a file",
  },
};
