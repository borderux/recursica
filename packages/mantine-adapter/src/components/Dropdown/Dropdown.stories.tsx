import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Dropdown> = {
  title: "UI-Kit/🚧 Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Dropdown" />,
};
