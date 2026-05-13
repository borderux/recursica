import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Checkbox> = {
  title: "UI-Kit/🚧 Checkbox",
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Checkbox" />,
};
