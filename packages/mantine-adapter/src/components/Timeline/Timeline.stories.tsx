import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Timeline> = {
  title: "UI-Kit/🚧 Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Timeline" />,
};
