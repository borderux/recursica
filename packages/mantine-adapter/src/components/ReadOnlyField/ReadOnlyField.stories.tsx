import type { Meta, StoryObj } from "@storybook/react";
import { ReadOnlyField } from "./ReadOnlyField";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof ReadOnlyField> = {
  title: "UI-Kit/🚧 ReadOnlyField",
  component: ReadOnlyField,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ReadOnlyField>;

export const Default: Story = {
  render: () => <ComingSoon componentName="ReadOnlyField" />,
};
