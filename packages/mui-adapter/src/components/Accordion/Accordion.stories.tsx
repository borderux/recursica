import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Accordion> = {
  title: "UI-Kit/🚧 Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Accordion" />,
};
