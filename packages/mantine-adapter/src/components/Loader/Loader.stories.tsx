import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Loader> = {
  title: "UI-Kit/🚧 Loader",
  component: Loader,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Loader" />,
};
