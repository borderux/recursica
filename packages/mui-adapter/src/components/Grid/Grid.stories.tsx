import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid";
import { Card } from "../Card/Card";
import { Text } from "../Text/Text";

type GridStoryProps = React.ComponentProps<typeof Grid>;

const meta: Meta<GridStoryProps> = {
  title: "UI-Kit/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Grid is a 12-column (by default) responsive grid layout hand-composed from MUI's Grid, providing column spans, offsets, ordering, and breakpoint-based visibility with the same API as the mantine-adapter's Grid/Grid.Col.",
      },
    },
    controls: {
      include: ["children", "gap", "columns", "grow", "justify", "align"],
    },
  },
  args: {
    gap: "rec-default",
    columns: 12,
    grow: false,
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
      ],
      description: "Gap between columns",
    },
    columns: {
      control: "number",
      description: "Number of columns in each row",
    },
    grow: {
      control: "boolean",
      description: "Columns in the last row expand to fill available space",
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
    align: {
      control: "select",
      options: ["flex-start", "center", "flex-end", "stretch"],
      description: "Align-items property",
    },
  },
};

export default meta;

type Story = StoryObj<GridStoryProps>;

const Swatch = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <Card.Content>
      <Text>{children}</Text>
    </Card.Content>
  </Card>
);

export const Default: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const ResponsiveSpans: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const Offset: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={4} offset={4}>
        <Swatch>span 4, offset 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const Grow: Story = {
  args: {
    grow: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={3}>
        <Swatch>span 3</Swatch>
      </Grid.Col>
      <Grid.Col span={3}>
        <Swatch>span 3</Swatch>
      </Grid.Col>
      <Grid.Col span={3}>
        <Swatch>span 3 (grows to fill row)</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const CustomColumnCount: Story = {
  args: {
    columns: 6,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const VisibleHiddenFrom: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col span={6} hiddenFrom="sm">
        <Swatch>hidden from sm and up</Swatch>
      </Grid.Col>
      <Grid.Col span={6} visibleFrom="sm">
        <Swatch>visible from sm and up</Swatch>
      </Grid.Col>
    </Grid>
  ),
};
