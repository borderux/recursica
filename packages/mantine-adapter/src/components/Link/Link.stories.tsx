import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Link> = {
  title: "UI-Kit/🚧 Link",
  component: Link,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Link" />,
};
