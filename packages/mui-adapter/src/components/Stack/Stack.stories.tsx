import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./Stack";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Stack> = {
  title: "UI-Kit/🚧 Stack",
  component: Stack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Stack" />,
};
