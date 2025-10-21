import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileInput } from "./FileInput";
import { formFieldLayoutArgTypes } from "../FormFieldLayout/FormFieldLayout.stories.helper";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
  argTypes: {
    ...formFieldLayoutArgTypes,
    multiple: {
      control: "boolean",
      description: "Allow multiple file selection",
    },
    State: {
      control: { type: "select" },
      options: ["Enabled", "Disabled", "Error", "Error focused", "Focused"],
      description: "Visual state for testing purposes",
    },
    Upload_icon: {
      control: "boolean",
      description: "Show/hide the upload icon",
    },
    Clear_icon: {
      control: "boolean",
      description: "Show/hide the clear icon",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FileInputDemo = (args: any) => {
  const [value, setValue] = useState<File | File[] | null>(null);

  return <FileInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: {
    Label: "File Input",
    State: "Enabled",
    Upload_icon: true,
    Clear_icon: true,
    Help_text: "Select files to upload",
    Error_text: "",
    required: false,
    disabled: false,
    multiple: false,
    placeholder: "Select a file",
  },
  render: FileInputDemo,
};
