import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Timeline> = {
  title: "UI-Kit/🚧 Timeline",
  component: Timeline,
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
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Timeline" />,
};
