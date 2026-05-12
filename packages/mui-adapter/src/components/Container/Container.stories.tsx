import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Container> = {
  title: "UI-Kit/🚧 Container",
  component: Container,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Container" />,
};
