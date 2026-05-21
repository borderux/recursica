import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./Autocomplete";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Autocomplete> = {
  title: "UI-Kit/🚧 Autocomplete",
  component: Autocomplete,
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
type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Autocomplete" />,
};
