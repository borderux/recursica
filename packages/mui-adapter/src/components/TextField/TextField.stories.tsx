import type { Meta, StoryObj } from "@storybook/react";
import { TextField } from "./TextField";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TextField> = {
  title: "UI-Kit/🚧 TextField",
  component: TextField,
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
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TextField" />,
};
