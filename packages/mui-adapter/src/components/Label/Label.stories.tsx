/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { TextField } from "../TextField/TextField";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

type LabelStoryProps = React.ComponentProps<typeof Label>;

const meta: Meta<LabelStoryProps> = {
  title: "UI-Kit/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Label` component is a strict Recursica-styled wrapper around MUI's native `InputLabel`. It serves as the primary compositional primitive for all form fields, preserving MUI's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nWhen working with form structures, render this `Label` component directly above your inputs or supply it to a component's overriding properties. The component automatically maps structural layout dimensions, dynamic alignment (`left` vs `right`), custom indicator gaps, and integrates a customized `optionalText` and `withEditIcon` flow that safely bypasses MUI's native required asterisk mechanisms.",
      },
    },
    controls: {
      include: [
        "labelSize",
        "labelAlignment",
        "required",
        "labelOptionalText",
        "labelWithEditIcon",
        "children",
      ],
    },
  },
  argTypes: {
    ...formControlArgTypes,
  },
};

export default meta;

type Story = StoryObj<LabelStoryProps>;

// Utility mapping to pipe raw Label args structurally into TextField accurately
const renderWithTextField = ({ children, withLayer, layer, ...args }: any) => (
  <TextField
    label={children as React.ReactNode}
    placeholder="Form Control primitive mapped..."
    {...(args as any)}
  />
);

export const Default: Story = {
  args: {
    children: "Dynamic Label (Controls)",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false,
  },
  render: renderWithTextField,
};

export const StackedDefault: Story = {
  args: {
    children: "Email Address",
  },
  render: renderWithTextField,
};

export const StackedRequired: Story = {
  args: {
    children: "Primary Network Node",
    required: true,
  },
  render: renderWithTextField,
};

export const StackedWithEditIcon: Story = {
  args: {
    children: "Environment Variables",
    labelWithEditIcon: true,
  },
  render: renderWithTextField,
};

export const SideBySideDefault: Story = {
  args: {
    children: "Status",
    labelSize: "default",
  },
  render: renderWithTextField,
};

export const RequiredSuppressesOptionalText: Story = {
  args: {
    children: "Full Name",
    required: true,
    labelOptionalText: "This should not render",
  },
  render: renderWithTextField,
};

export const BooleanOptionalText: Story = {
  args: {
    children: "Middle Initial",
    labelOptionalText: true,
  },
  render: renderWithTextField,
};

export const WithEditIcon: Story = {
  args: {
    children: "Shipping Address",
    labelWithEditIcon: true,
  },
  render: renderWithTextField,
};
