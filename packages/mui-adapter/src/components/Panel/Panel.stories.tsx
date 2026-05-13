import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from "./Panel";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Panel> = {
  title: "UI-Kit/🚧 Panel",
  component: Panel,
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
type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Panel" />,
};
