import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Switch> = {
  title: "UI-Kit/🚧 Switch",
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Switch" />,
};
