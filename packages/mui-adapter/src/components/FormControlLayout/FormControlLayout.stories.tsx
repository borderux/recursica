import type { Meta, StoryObj } from "@storybook/react";
import { FormControlLayout } from "./FormControlLayout";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FormControlLayout> = {
  title: "UI-Kit/🚧 FormControlLayout",
  component: FormControlLayout,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormControlLayout>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FormControlLayout" />,
};
