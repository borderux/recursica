import type { Meta, StoryObj } from "@storybook/react";
import { FormControlLayout } from "./FormControlLayout";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FormControlLayout> = {
  title: "UI-Kit/🚧 FormControlLayout",
  component: FormControlLayout,
  tags: ["autodocs"],
  parameters: {
    controls: {
      include: [
        "layer",
        "withLayer",
        "children",
        "component",
        "variant",
        "size",
        "icon",
        "disabled",
        "href",
        "onClick",
        "onChange",
        "value",
        "checked",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormControlLayout>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FormControlLayout" />,
};
