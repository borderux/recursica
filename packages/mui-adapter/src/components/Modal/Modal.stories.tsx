import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { ComingSoon } from "@recursica/storybook-template";

const meta: Meta<typeof Modal> = {
  title: "UI-Kit/🚧 Modal",
  component: Modal,
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
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => <ComingSoon componentName="Modal" />,
};
