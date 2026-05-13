import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Avatar> = {
  title: "UI-Kit/🚧 Avatar",
  component: Avatar,
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
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Avatar" />,
};
