import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Layout: "Stacked",
    State: "Enabled",
    Upload_icon: true,
    Clear_icon: true,
    Help_text: "Help text",
  },
};
