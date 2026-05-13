import type { Meta, StoryObj } from "@storybook/react";
import { TransferList } from "./TransferList";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof TransferList> = {
  title: "UI-Kit/🚧 TransferList",
  component: TransferList,
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
type Story = StoryObj<typeof TransferList>;

export const Default: Story = {
  render: () => <ComingSoon componentName="TransferList" />,
};
