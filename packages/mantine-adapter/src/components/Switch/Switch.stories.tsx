import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Switch> = {
  title: "UI-Kit/🚧 Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Switch" />,
};
