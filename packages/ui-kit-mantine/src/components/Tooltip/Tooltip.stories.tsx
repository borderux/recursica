import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: <Button label="Tooltip" />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overflow: Story = {
  args: {
    label:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    position: "top",
  },
};

export const Top: Story = {
  args: {
    label: "Tooltip",
    position: "top",
  },
};

export const TopStart: Story = {
  args: {
    label: "Tooltip",
    position: "top-start",
  },
};

export const TopEnd: Story = {
  args: {
    label: "Tooltip",
    position: "top-end",
  },
};

export const Bottom: Story = {
  args: {
    label: "Tooltip",
    position: "bottom",
  },
};

export const BottomStart: Story = {
  args: {
    label: "Tooltip",
    position: "bottom-start",
  },
};

export const BottomEnd: Story = {
  args: {
    label: "Tooltip",
    position: "bottom-end",
  },
};

export const Left: Story = {
  args: {
    label: "Tooltip",
    position: "left",
  },
};

export const LeftStart: Story = {
  args: {
    label: "Tooltip",
    position: "left-start",
  },
};

export const LeftEnd: Story = {
  args: {
    label: "Tooltip",
    position: "left-end",
  },
};

export const Right: Story = {
  args: {
    label: "Tooltip",
    position: "right",
  },
};

export const RightStart: Story = {
  args: {
    label: "Tooltip",
    position: "right-start",
  },
};

export const RightEnd: Story = {
  args: {
    label: "Tooltip",
    position: "right-end",
  },
};
