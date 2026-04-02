import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Modal> = {
  title: "UI-Kit/🚧 Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Modal" />,
};
