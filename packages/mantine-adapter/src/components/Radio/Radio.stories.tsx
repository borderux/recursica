import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Radio> = {
  title: "UI-Kit/🚧 Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Radio" />,
};
