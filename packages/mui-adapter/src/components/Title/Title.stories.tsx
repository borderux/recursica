import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./Title";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Title> = {
  title: "UI-Kit/🚧 Title",
  component: Title,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Title>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Title" />,
};
