import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Group } from "./Group";
import { Button } from "../Button";
import { Text } from "../Text/Text";

type GroupStoryProps = React.ComponentProps<typeof Group>;

const meta: Meta<GroupStoryProps> = {
  title: "UI-Kit/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Group is a flex horizontal layout container that maps directly to Mantine's Group component allowing safe layout property passing.",
      },
    },
    controls: {
      include: [
        "layer",
        "withLayer",
        "gap",
        "alignItems",
        "justifyContent",
        "flexWrap",
        "defaultChecked",
        "rowGap",
        "columnGap",
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
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
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
    flexWrap: {
      control: "select",
      options: ["wrap", "nowrap", "wrap-reverse"],
      description: "Flex-wrap property",
    },
    defaultChecked: {
      table: { disable: true },
    },
    rowGap: {
      table: { disable: true },
    },
    columnGap: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<GroupStoryProps>;

export const Default: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Group {...args}>
      <Button variant="solid">Primary</Button>
      <Button variant="outline">Secondary</Button>
      <Text>Text element within Group</Text>
    </Group>
  ),
};

export const StaticGapSmall: Story = {
  args: {
    gap: "rec-sm",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Group {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Group>
  ),
};

export const StaticGapLarge: Story = {
  args: {
    gap: "rec-xl",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Group {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Group>
  ),
};
