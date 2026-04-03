import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Tooltip> = {
  title: "UI-Kit/🚧 Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Tooltip" />,
};
