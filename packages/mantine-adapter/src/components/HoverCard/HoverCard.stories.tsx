import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "./HoverCard";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof HoverCard> = {
  title: "UI-Kit/🚧 HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => <ComingSoon componentName="HoverCard" />,
};
