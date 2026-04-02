import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FileInput> = {
  title: "UI-Kit/🚧 FileInput",
  component: FileInput,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FileInput" />,
};
