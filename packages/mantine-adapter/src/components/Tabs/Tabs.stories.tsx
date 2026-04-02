import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Tabs> = {
  title: "UI-Kit/🚧 Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Tabs" />,
};
