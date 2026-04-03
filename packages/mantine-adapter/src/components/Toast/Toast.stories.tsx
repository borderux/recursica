import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Toast> = {
  title: "UI-Kit/🚧 Toast",
  component: Toast,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Toast" />,
};
