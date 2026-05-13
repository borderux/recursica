import type { Meta, StoryObj } from "@storybook/react";
import { FileInput } from "./FileInput";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FileInput> = {
  title: "UI-Kit/🚧 FileInput",
  component: FileInput,
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
type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FileInput" />,
};
