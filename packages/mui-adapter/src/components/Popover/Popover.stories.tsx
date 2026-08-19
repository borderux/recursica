import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "../Button";
import { Text } from "../Text/Text";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PopoverStoryArgs = Record<string, any>;

const meta: Meta = {
  title: "UI-Kit/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    controls: {
      // Explicitly list only the props integrators should configure — Mui's
      // underlying Tooltip props would otherwise leak into Controls.
      include: ["withBeak", "position", "defaultOpened"],
    },
    docs: {
      description: {
        component:
          "The `Popover` component is a composable wrapper around Mui's Tooltip in click-controlled mode. It displays a dropdown panel when the user clicks a target element.",
      },
    },
  },
  argTypes: {
    withBeak: {
      control: "boolean",
      description:
        "Whether to display a beak (arrow) pointing from the dropdown to the target.",
    },
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
      description: "Dropdown position relative to target",
    },
    defaultOpened: {
      control: "boolean",
      description: "Initial opened state",
    },
  },
};

export default meta;
type Story = StoryObj<PopoverStoryArgs>;

export const Default: Story = {
  args: {
    withBeak: true,
    position: "top",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PopoverStoryArgs) => {
    return (
      <Popover width={250} {...args}>
        <Popover.Target>
          <Button variant="solid">Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>
            This is the popover content. It can contain any elements you want to
            display when the user clicks the target.
          </Text>
        </Popover.Dropdown>
      </Popover>
    );
  },
};

export const SolidDefault: Story = {
  args: {
    withBeak: true,
    position: "top",
    defaultOpened: true,
  },
  parameters: {
    layout: "centered",
    controls: { disable: true },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PopoverStoryArgs) => {
    return (
      <Popover width={200} {...args}>
        <Popover.Target>
          <Button variant="solid">Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>
            This is a static representation of an opened popover with a beak.
          </Text>
        </Popover.Dropdown>
      </Popover>
    );
  },
};

export const WithoutBeak: Story = {
  args: {
    withBeak: false,
    position: "bottom",
    defaultOpened: true,
  },
  parameters: {
    layout: "centered",
    controls: { disable: true },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PopoverStoryArgs) => {
    return (
      <Popover width={200} {...args}>
        <Popover.Target>
          <Button variant="outline">Bottom Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>This popover is positioned at the bottom and has no beak.</Text>
        </Popover.Dropdown>
      </Popover>
    );
  },
};
