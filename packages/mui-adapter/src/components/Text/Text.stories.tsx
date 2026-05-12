import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Text> = {
  title: "UI-Kit/🚧 Text",
  component: Text,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Text" />,
};
