import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Table> = {
  title: "UI-Kit/🚧 Table",
  component: Table,
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
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Table" />,
};
