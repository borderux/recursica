import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TextArea> = {
  title: "UI-Kit/🚧 TextArea",
  component: TextArea,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TextArea" />,
};
