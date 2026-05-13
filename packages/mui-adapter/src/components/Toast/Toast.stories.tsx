import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Toast> = {
  title: "UI-Kit/🚧 Toast",
  component: Toast,
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
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Toast" />,
};
