import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "./TimePicker";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TimePicker> = {
  title: "UI-Kit/🚧 TimePicker",
  component: TimePicker,
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
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TimePicker" />,
};
