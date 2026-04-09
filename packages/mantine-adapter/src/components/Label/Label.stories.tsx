/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { Layer } from "@recursica/adapter-common";
import { TextField } from "../TextField/TextField";

type LabelStoryProps = React.ComponentProps<typeof Label> & {
  layer?: number;
};

const meta: Meta<LabelStoryProps> = {
  title: "UI-Kit/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses Mantine's native required asterisk mechanisms.",
      },
    },
  },
  argTypes: {
    formLayout: {
      control: "radio",
      options: ["stacked", "side-by-side"],
      description: "Layout structure of the Label component",
    },
    labelSize: {
      control: "radio",
      options: ["default", "small"],
    },
    labelAlignment: {
      control: "radio",
      options: ["left", "right"],
      description: "Text and layout alignment for the Label",
    },
    required: {
      control: "boolean",
    },
    labelOptionalText: {
      control: "text",
      description: "String or boolean (if true, renders 'Optional')",
    },
    labelWithEditIcon: {
      control: "boolean",
    },
    layer: {
      control: "radio",
      options: [0, 1, 2, 3],
      description: "The design system layer context",
      table: {
        category: "Story Controls",
      },
    },
  },
};

export default meta;

type Story = StoryObj<LabelStoryProps>;

// Utility mapping to pipe raw Label args structurally into TextField accurately
const renderWithTextField = ({
  layer = 0,
  children,
  ...args
}: LabelStoryProps) => (
  <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "24px" }}>
    <TextField
      label={children as React.ReactNode}
      placeholder="Form Control primitive mapped..."
      {...(args as any)}
    />
  </Layer>
);

export const Default: Story = {
  args: {
    children: "Dynamic Label (Controls)",
    formLayout: "stacked",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false,
    layer: 0,
  },
  render: renderWithTextField,
};

export const StackedDefault: Story = {
  args: {
    children: "Email Address",
    formLayout: "stacked",
  },
  render: renderWithTextField,
};

export const StackedRequired: Story = {
  args: {
    children: "Primary Network Node",
    formLayout: "stacked",
    required: true,
  },
  render: renderWithTextField,
};

export const StackedWithEditIcon: Story = {
  args: {
    children: "Environment Variables",
    formLayout: "stacked",
    labelWithEditIcon: true,
  },
  render: renderWithTextField,
};

export const SideBySideDefault: Story = {
  args: {
    children: "Status",
    formLayout: "side-by-side",
    labelSize: "default",
  },
  render: renderWithTextField,
};

export const RequiredSuppressesOptionalText: Story = {
  args: {
    children: "Full Name",
    formLayout: "stacked",
    required: true,
    labelOptionalText: "This should not render",
  },
  render: renderWithTextField,
};

export const BooleanOptionalText: Story = {
  args: {
    children: "Middle Initial",
    formLayout: "side-by-side",
    labelOptionalText: true,
  },
  render: renderWithTextField,
};

export const WithEditIcon: Story = {
  args: {
    children: "Shipping Address",
    formLayout: "side-by-side",
    labelWithEditIcon: true,
  },
  render: renderWithTextField,
};

export const LayerOneSideBySide: Story = {
  args: {
    children: "Configuration",
    formLayout: "side-by-side",
    labelWithEditIcon: true,
    layer: 1,
  },
  render: renderWithTextField,
};
