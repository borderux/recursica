import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Slider> = {
  title: "UI-Kit/🚧 Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Slider" />,
};
