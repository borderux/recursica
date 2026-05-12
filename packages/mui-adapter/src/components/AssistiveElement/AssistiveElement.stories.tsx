import type { Meta, StoryObj } from "@storybook/react";
import { AssistiveElement } from "./AssistiveElement";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof AssistiveElement> = {
  title: "UI-Kit/🚧 AssistiveElement",
  component: AssistiveElement,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AssistiveElement>;

export const Default: Story = {
  render: () => <ComingSoon componentName="AssistiveElement" />,
};
