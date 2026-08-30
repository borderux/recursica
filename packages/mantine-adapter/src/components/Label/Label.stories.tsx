import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { Button } from "../Button/Button";

type LabelStoryProps = React.ComponentProps<typeof Label>;

const meta: Meta<LabelStoryProps> = {
  title: "UI-Kit/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nThis component only renders the label itself — layout concerns like `stacked` vs `side-by-side` positioning relative to an input live on `FormControlLayout`/`FormControlWrapper`, not here. Render this `Label` in isolation to verify its own states, or see `UI-Kit/FormControlLayout` for how it composes into a full form field.",
      },
    },
  },
  argTypes: {
    labelSize: {
      control: "inline-radio",
      options: ["default", "small"],
      description:
        "Sizing metrics for the Label. Only visually distinguishable once composed inside a `side-by-side` FormControlLayout, which is where the resulting width constraint applies.",
    },
    labelAlignment: {
      control: "inline-radio",
      options: ["left", "right"],
      description: "Text alignment of the label content.",
    },
    required: {
      control: "boolean",
      description:
        "Renders the required asterisk (suppressed automatically when `labelWithEditIcon` is set, and mutually exclusive with `labelOptionalText`).",
    },
    labelOptionalText: {
      control: "text",
      description:
        "Secondary text rendered beneath the label. Pass `true` for the default '(Optional)' string, or a custom node/string. Suppressed when `required` is true.",
    },
    labelWithEditIcon: {
      control: "boolean",
      description:
        "Replaces the default edit icon slot with an interactive edit affordance; replaces the required asterisk visually when both are set.",
    },
    labelActionArea: {
      table: { disable: true },
    },
    onLabelEditClick: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<LabelStoryProps>;

export const Default: Story = {
  args: {
    children: "Label",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false,
  },
};

export const Required: Story = {
  args: {
    children: "Required Field",
    required: true,
  },
};

export const RequiredSuppressesOptionalText: Story = {
  args: {
    children: "Full Name",
    required: true,
    labelOptionalText: "This should not render",
  },
};

export const WithOptionalText: Story = {
  args: {
    children: "Bio",
    labelOptionalText: "Max 100 characters",
  },
};

export const BooleanOptionalText: Story = {
  args: {
    children: "Middle Initial",
    labelOptionalText: true,
  },
};

export const WithEditIcon: Story = {
  args: {
    children: "Shipping Address",
    labelWithEditIcon: true,
  },
};

export const RequiredWithEditIcon: Story = {
  args: {
    children: "Primary Network Node",
    required: true,
    labelWithEditIcon: true,
  },
};

export const RightAligned: Story = {
  args: {
    children: "Status",
    labelAlignment: "right",
  },
};

export const WithActionArea: Story = {
  args: {
    children: "Configuration",
    labelActionArea: (
      <Button variant="text" size="small">
        Edit
      </Button>
    ),
  },
};
