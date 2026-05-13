import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "../Button";
import { Text } from "../Text/Text";
import { Stack } from "../Stack/Stack";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PopoverStoryArgs = Record<string, any>;

const meta = {
  title: "UI-Kit/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Popover` component is a composable wrapper around Mantine's Popover. It displays a dropdown panel when the user clicks or interacts with a target element.",
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
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

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
          <Text size="rec-sm">
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
    controls: { disable: true },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PopoverStoryArgs) => {
    return (
      <Stack align="center" justify="center" style={{ padding: "100px" }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="solid">Toggle Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This is a static representation of an opened popover with a beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>
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
    controls: { disable: true },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PopoverStoryArgs) => {
    return (
      <Stack align="center" justify="center" style={{ padding: "100px" }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="outline">Bottom Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This popover is positioned at the bottom and has no beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>
    );
  },
};
