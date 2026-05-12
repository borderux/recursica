import type { Meta, StoryObj } from "@storybook/react";
import { Group } from "./Group";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Group> = {
  title: "UI-Kit/🚧 Group",
  component: Group,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Group>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Group" />,
};
