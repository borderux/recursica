import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "./Stepper";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Stepper> = {
  title: "UI-Kit/🚧 Stepper",
  component: Stepper,
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
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Stepper" />,
};
