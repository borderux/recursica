import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FileUpload> = {
  title: "UI-Kit/🚧 FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FileUpload" />,
};
