import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./NumberInput";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof NumberInput> = {
  title: "UI-Kit/🚧 NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: () => <ComingSoon componentName="NumberInput" />,
};
