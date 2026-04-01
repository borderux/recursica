import type { ArgTypes } from "@storybook/react";
import { FormFieldLayoutProps } from "./FormFieldLayout";
import { LAYER_ARG_TYPES } from "../Layer/stories.util";

export const formFieldLayoutArgTypes: ArgTypes<FormFieldLayoutProps> = {
  Layout: {
    control: "select",
    options: ["Stacked", "Side-by-side"],
    description:
      "Layout orientation - Stacked (single column) or Side-by-side (2 columns with 248px label area)",
    defaultValue: "Stacked",
  },
  required: {
    control: "boolean",
    description: "Whether the field is required",
    defaultValue: false,
  },
  disabled: {
    control: "boolean",
    description: "Whether the field is disabled",
    defaultValue: false,
  },
  Help_text: {
    control: "text",
    description: "Help text to display below the input",
    defaultValue: "This is the help text",
  },
  Error_text: {
    control: "text",
    description:
      "Error text to display below the input.  If not set, the description will be shown",
    defaultValue: "",
  },
  Show_label: {
    control: "boolean",
    description:
      "Whether to show the label.  IT will be hidden, but still be in the DOM",
    defaultValue: true,
  },
  Indicator: {
    control: "select",
    options: [
      "none",
      "optional",
      "asterisk / truncate overflow",
      "asterisk / full label text",
    ],
    description: "Indicator to display next to the label",
    defaultValue: "none",
  },
  ...LAYER_ARG_TYPES,
  children: {
    table: { disable: true },
  },
  LabelProps: {
    table: { disable: true },
  },
  Help_textProps: {
    table: { disable: true },
  },
  Error_textProps: {
    table: { disable: true },
  },
};
