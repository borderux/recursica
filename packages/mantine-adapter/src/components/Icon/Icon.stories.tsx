/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { Icon, IconNames } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    name: {
      control: { type: "select" },
      options: IconNames,
      description: "The icon name from the icon resource map",
    },
    size: {
      control: { type: "number" },
      description: "Icon size in pixels",
    },
    color: {
      control: { type: "color" },
      description: "The color to apply to the icon",
    },
    title: {
      control: { type: "text" },
      description: "The title to apply to the icon",
    },
    onClick: { table: { disable: true } },
  },
  parameters: {
    controls: {
      include: ["name", "size", "color", "title"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "chevron_down_solid",
    size: 24,
    color: "currentColor",
    title: "Chevron down",
  },
};
