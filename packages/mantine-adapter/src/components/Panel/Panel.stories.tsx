import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from "./Panel";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Panel> = {
  title: "UI-Kit/🚧 Panel",
  component: Panel,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Panel" />,
};
