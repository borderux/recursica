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
          "Grid is a 12-column (by default) responsive grid layout hand-composed from MUI's own Grid, providing column sizing, offsets, ordering, and breakpoint-based visibility using MUI's native prop names.",
      },
    },
    controls: {
      include: ["children", "spacing", "columns", "direction", "wrap"],
    },
  },
  args: {
    spacing: "rec-default",
    columns: 12,
  },
  argTypes: {
    spacing: {
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
      description: "Space between columns",
    },
    columns: {
      control: "number",
      description: "Number of columns in each row",
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
      <Grid.Col size={4}>
        <Swatch>size 4</Swatch>
      </Grid.Col>
      <Grid.Col size={4}>
        <Swatch>size 4</Swatch>
      </Grid.Col>
      <Grid.Col size={4}>
        <Swatch>size 4</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const ResponsiveSizes: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col size={{ xs: 12, sm: 6, md: 3 }}>
        <Swatch>xs 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col size={{ xs: 12, sm: 6, md: 3 }}>
        <Swatch>xs 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col size={{ xs: 12, sm: 6, md: 3 }}>
        <Swatch>xs 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col size={{ xs: 12, sm: 6, md: 3 }}>
        <Swatch>xs 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const Offset: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col size={4} offset={4}>
        <Swatch>size 4, offset 4</Swatch>
      </Grid.Col>
      <Grid.Col size={4}>
        <Swatch>size 4</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const Grow: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col size={3}>
        <Swatch>size 3</Swatch>
      </Grid.Col>
      <Grid.Col size={3}>
        <Swatch>size 3</Swatch>
      </Grid.Col>
      <Grid.Col size="grow">
        <Swatch>size &quot;grow&quot; (fills remaining space)</Swatch>
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
      <Grid.Col size={2}>
        <Swatch>size 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col size={2}>
        <Swatch>size 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col size={2}>
        <Swatch>size 2 of 6</Swatch>
      </Grid.Col>
    </Grid>
  ),
};

export const VisibleHiddenFrom: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Grid {...args}>
      <Grid.Col size={6} hiddenFrom="sm">
        <Swatch>hidden from sm and up</Swatch>
      </Grid.Col>
      <Grid.Col size={6} visibleFrom="sm">
        <Swatch>visible from sm and up</Swatch>
      </Grid.Col>
    </Grid>
  ),
};
