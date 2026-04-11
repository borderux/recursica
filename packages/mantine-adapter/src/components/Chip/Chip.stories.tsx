import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Chip> = {
  title: "UI-Kit/🚧 Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Chip" />,
};
