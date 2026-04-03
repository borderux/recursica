import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "./TimePicker";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TimePicker> = {
  title: "UI-Kit/🚧 TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TimePicker" />,
};
