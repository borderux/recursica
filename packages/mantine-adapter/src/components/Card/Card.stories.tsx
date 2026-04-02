import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Card> = {
  title: "UI-Kit/🚧 Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Card" />,
};
