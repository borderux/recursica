import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Pagination> = {
  title: "UI-Kit/🚧 Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Pagination" />,
};
