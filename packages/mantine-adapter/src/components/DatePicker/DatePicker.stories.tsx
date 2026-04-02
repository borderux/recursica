import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof DatePicker> = {
  title: "UI-Kit/🚧 DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => <ComingSoon componentName="DatePicker" />,
};
