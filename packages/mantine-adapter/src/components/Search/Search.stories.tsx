import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "./Search";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Search> = {
  title: "UI-Kit/🚧 Search",
  component: Search,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Search>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Search" />,
};
