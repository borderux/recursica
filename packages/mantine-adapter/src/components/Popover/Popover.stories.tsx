import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Popover> = {
  title: "UI-Kit/🚧 Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Popover" />,
};
