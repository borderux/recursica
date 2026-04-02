import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Stepper> = {
  title: "UI-Kit/🚧 Stepper",
  component: Stepper,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Stepper" />,
};
