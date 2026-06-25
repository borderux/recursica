import type { Meta, StoryObj } from "@storybook/react";
import { Tree } from "./Tree";

const meta: Meta<typeof Tree> = {
  title: "Components/Tree",
  component: Tree,
};

export default meta;
type Story = StoryObj<typeof Tree>;

export const ComingSoon: Story = {
  args: {},
};
