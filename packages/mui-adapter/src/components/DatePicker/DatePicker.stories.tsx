import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof DatePicker> = {
  title: "UI-Kit/🚧 DatePicker",
  component: DatePicker,
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
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => <ComingSoon componentName="DatePicker" />,
};
