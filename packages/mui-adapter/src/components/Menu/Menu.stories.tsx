import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Menu> = {
  title: "UI-Kit/🚧 Menu",
  component: Menu,
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
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Menu" />,
};
