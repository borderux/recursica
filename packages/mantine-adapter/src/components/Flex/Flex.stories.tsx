import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "./Flex";
import { Button } from "../Button";
import { Text } from "../Text/Text";

type FlexStoryProps = React.ComponentProps<typeof Flex>;

const meta: Meta<FlexStoryProps> = {
  title: "UI-Kit/Flex",
  component: Flex,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Flex is a bare-metal flex container that maps directly to Mantine's Flex component, providing unopinionated control over direction, alignment, and wrapping.",
      },
    },
  },
  args: {
    gap: "rec-default",
    align: "center",
    justify: "flex-start",
    direction: "row",
    wrap: "wrap",
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
    direction: {
      control: "select",
      options: ["row", "column", "row-reverse", "column-reverse"],
      description: "Flex-direction property",
    },
    align: {
      control: "select",
      options: ["flex-start", "center", "flex-end", "stretch"],
      description: "Align-items property",
    },
    justify: {
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
    wrap: {
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

type Story = StoryObj<FlexStoryProps>;

export const Default: Story = {
  render: (args) => (
    <Flex {...args}>
      <Button variant="solid">Block A</Button>
      <Button variant="outline">Block B</Button>
      <Text>Text inside Flex</Text>
    </Flex>
  ),
};

export const StaticGapSmallColumn: Story = {
  args: {
    gap: "rec-sm",
    direction: "column",
  },
  render: (args) => (
    <Flex {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Flex>
  ),
};

export const StaticGapLargeRow: Story = {
  args: {
    gap: "rec-xl",
    direction: "row",
  },
  render: (args) => (
    <Flex {...args}>
      <Button variant="solid">Item 1</Button>
      <Button variant="solid">Item 2</Button>
      <Button variant="solid">Item 3</Button>
    </Flex>
  ),
};
