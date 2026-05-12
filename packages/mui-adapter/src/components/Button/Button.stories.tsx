import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Button> = {
  title: "UI-Kit/🚧 Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Button" />,
};
