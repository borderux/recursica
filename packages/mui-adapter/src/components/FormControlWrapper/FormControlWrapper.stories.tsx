import type { Meta, StoryObj } from "@storybook/react";
import { FormControlWrapper } from "./FormControlWrapper";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof FormControlWrapper> = {
  title: "UI-Kit/🚧 FormControlWrapper",
  component: FormControlWrapper,
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
type Story = StoryObj<typeof FormControlWrapper>;

export const Default: Story = {
  render: () => <ComingSoon componentName="FormControlWrapper" />,
};
