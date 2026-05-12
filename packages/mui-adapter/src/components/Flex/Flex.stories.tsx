import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./Flex";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Flex> = {
  title: "UI-Kit/🚧 Flex",
  component: Flex,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Flex>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Flex" />,
};
