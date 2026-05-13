import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Label> = {
  title: "UI-Kit/🚧 Label",
  component: Label,
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
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Label" />,
};
