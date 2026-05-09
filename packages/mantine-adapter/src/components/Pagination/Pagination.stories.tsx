import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "UI-Kit/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    total: { control: "number" },
    withEdges: { control: "boolean" },
    withControls: { control: "boolean" },
    disabled: { control: "boolean" },
    withLabels: {
      control: "boolean",
      description: "Toggle text labels alongside icons",
    },
    defaultChecked: { table: { disable: true } },
  },
  args: {
    total: 10,
    withEdges: false,
    withControls: true,
    withLabels: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: any) => {
    return <Pagination {...args} />;
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const WithEdges: Story = {
  args: {
    withEdges: true,
  },
};

export const Compositional: Story = {
  render: () => (
    <Pagination.Root total={10}>
      <Pagination.Items />
    </Pagination.Root>
  ),
};

export const WithTextLabels: Story = {
  args: {
    withEdges: true,
    withLabels: true,
  },
};
