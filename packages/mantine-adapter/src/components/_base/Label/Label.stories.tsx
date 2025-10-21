/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/_Base/Label",
  component: Label,
  argTypes: {
    Show_label: {
      control: "boolean",
      description: "Boolean to show/hide the label",
    },
    Indicator: {
      control: "select",
      options: [
        "none",
        "asterisk / truncate overflow",
        "asterisk / full label text",
        "optional",
      ],
      description: "Defines the required indicator and behavior",
    },
    Label: {
      control: "text",
      description: "Label text. You can also use the children prop",
    },
    children: {
      control: "table",
      table: {
        disable: true,
      },
    },
    Optional_text: {
      control: "text",
      description:
        "Optional text to display after the label. Default is (optional)",
    },
    Label_placement: {
      control: "select",
      options: ["top", "left"],
      description:
        "The placement of the label relative to the form input component",
    },
    required: {
      control: "boolean",
      description:
        "If true, forces Indicator to be asterisk type with truncate overflow as default.  This an HTML/mantine prop, not a Figma prop",
    },
    useLabelComponent: {
      control: "table",
      table: {
        disable: true,
      },
    },
  } as any,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    Label: "Default Label",
    Show_label: true,
    Indicator: "none",
    Optional_text: "(optional)",
    required: false,
    useLabelComponent: true,
  } as any,
};
