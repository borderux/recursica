/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormControlLayout } from "./FormControlLayout";
import { Switch } from "../Switch/Switch";

const meta: Meta<typeof FormControlLayout> = {
  title: "UI-Kit/FormControlLayout",
  component: FormControlLayout,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A layout component used to correctly position form inputs alongside their labels.\n\n**When to use this:**\nTypically, you should use `FormControlWrapper` instead, which uses this component under the hood to handle layout automatically.\n\nHowever, this component is useful when you need to align standalone inputs (like a `Switch` or `Checkbox` without a label) so they perfectly match the spacing and alignment of your other form fields in a `side-by-side` layout.",
      },
    },
    controls: {
      include: ["formLayout", "labelSize"],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    formLayout: {
      control: "radio",
      options: ["stacked", "side-by-side"],
    },
    labelSize: {
      control: "radio",
      options: ["default", "small", "md"],
      description: "Dictates the physical width of the left column.",
    },
    children: {
      table: { disable: true },
    },
    leftSection: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormControlLayout>;

/**
 * The Default layout demonstrates wrapping a standalone primitive without a Label.
 * In a stacked layout, an omitted leftSection naturally results in no structural padding.
 */
export const Default: Story = {
  args: {
    formLayout: "stacked",
    labelSize: "default",
    leftSection: (
      <div
        style={{ padding: 8, border: "1px dashed #ccc", background: "#fafafa" }}
      >
        Left Section Boundary
      </div>
    ),
    children: <Switch label="Input area content" />,
  },
  render: ({ ...args }: any) => <FormControlLayout {...args} />,
};

/**
 * Demonstrates the stacked layout without a left section.
 * The input should natively pull flush to the top left since there is no left column.
 */
export const StackedLayout: Story = {
  args: {
    formLayout: "stacked",
    labelSize: "default",
    children: <Switch label="Flush stacked switch" />,
  },
  render: ({ ...args }: any) => <FormControlLayout {...args} />,
};

/**
 * Demonstrates how a naked boolean primitive perfectly aligns in a side-by-side layout
 * by utilizing the layout wrapper. The left column maintains its precise design system width
 * even when `leftSection` is undefined, forcing the component into the correct form column!
 */
export const SideBySideLayout: Story = {
  args: {
    formLayout: "side-by-side",
    labelSize: "default",
    children: <Switch label="Offset switch aligning with grid" />,
  },
  render: ({ ...args }: any) => <FormControlLayout {...args} />,
};
