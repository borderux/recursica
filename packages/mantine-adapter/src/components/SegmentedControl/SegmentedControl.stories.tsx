import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl } from "./SegmentedControl";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof SegmentedControl> = {
  title: "UI-Kit/🚧 SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: () => <ComingSoon componentName="SegmentedControl" />,
};
