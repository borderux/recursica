import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Avatar> = {
  title: "UI-Kit/🚧 Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Avatar" />,
};
