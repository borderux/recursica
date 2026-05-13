import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Pagination> = {
  title: "UI-Kit/🚧 Pagination",
  component: Pagination,
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
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Pagination" />,
};
