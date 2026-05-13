import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TextArea> = {
  title: "UI-Kit/🚧 TextArea",
  component: TextArea,
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
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TextArea" />,
};
