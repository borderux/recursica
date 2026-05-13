import type { Meta, StoryObj } from "@storybook/react";
import { AssistiveElement } from "./AssistiveElement";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof AssistiveElement> = {
  title: "UI-Kit/🚧 AssistiveElement",
  component: AssistiveElement,
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
type Story = StoryObj<typeof AssistiveElement>;

export const Default: Story = {
  render: () => <ComingSoon componentName="AssistiveElement" />,
};
