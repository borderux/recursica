import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Badge> = {
  title: "UI-Kit/🚧 Badge",
  component: Badge,
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
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Badge" />,
};
