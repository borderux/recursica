import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI-Kit/🚧 Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Breadcrumb" />,
};
