import type { Meta, StoryObj } from "@storybook/react";
import { AssistiveElement } from "./AssistiveElement";
import { Layer } from "@recursica/adapter-common";
import React from "react";

const meta: Meta<typeof AssistiveElement> = {
  title: "UI-Kit/AssistiveElement",
  component: AssistiveElement,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `AssistiveElement` is a semantic structural primitive designed to standardize Helper and Error descriptive blocks natively beneath form components globally. By explicitly wiring to the `--recursica_ui-kit_components_assistive-element` layout tokens, this component safely injects custom SVGs (Alerts vs Info circles) alongside constrained flex-wrapping typography strings, preserving flawless line-height and alignment logic entirely decoupled from underlying input engine frameworks.",
      },
    },
  },
  argTypes: {
    assistiveVariant: {
      control: "radio",
      options: ["help", "error"],
    },
    assistiveWithIcon: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AssistiveElement>;

export const DefaultHelp: Story = {
  args: {
    children:
      "This is a standard assistive layout explaining specific configurations.",
    assistiveVariant: "help",
    assistiveWithIcon: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <AssistiveElement {...args} />
    </Layer>
  ),
};

export const ErrorState: Story = {
  args: {
    children:
      "Invalid property. You must satisfy the constraints outlined above.",
    assistiveVariant: "error",
    assistiveWithIcon: true,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <AssistiveElement {...args} />
    </Layer>
  ),
};

export const NoIconHelp: Story = {
  args: {
    children:
      "Fallback textual representation without visual injection targets.",
    assistiveVariant: "help",
    assistiveWithIcon: false,
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <AssistiveElement {...args} />
    </Layer>
  ),
};
