import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./Stack";
import { Button } from "../Button";
import { Text } from "../Text/Text";

type StackStoryProps = React.ComponentProps<typeof Stack>;

const meta: Meta<StackStoryProps> = {
  title: "UI-Kit/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Stack is a flex vertical layout container that maps directly to Mantine's Stack component allowing safe layout property passing.",
      },
    },
    controls: {
      include: [
        "layer",
        "withLayer",
        "gap",
        "alignItems",
        "justifyContent",
        "defaultChecked",
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
  args: {
    gap: "rec-default",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  argTypes: {
    gap: {
      control: "select",
      options: [
        "rec-none",
        "rec-sm",
        "rec-default",
        "rec-md",
        "rec-lg",
        "rec-xl",
        "rec-2xl",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
      ],
      description: "Gap between elements",
    },
    alignItems: {
      control: "select",
      options: ["flex-start", "center", "flex-end", "stretch"],
      description: "Align-items property",
    },
    justifyContent: {
      control: "select",
      options: [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
      ],
      description: "Justify-content property",
    },
    defaultChecked: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<StackStoryProps>;

export const Default: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Stack {...args}>
      <Button variant="solid">Primary Block</Button>
      <Button variant="outline">Secondary Block</Button>
      <Text>Text element within Stack</Text>
    </Stack>
  ),
};

export const StaticGapSmall: Story = {
  args: {
    gap: "rec-sm",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
  ),
};

export const StaticGapLarge: Story = {
  args: {
    gap: "rec-xl",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Stack {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Stack>
  ),
};
