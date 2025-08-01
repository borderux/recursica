import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxStoryComponent } from "./CheckboxStoryComponent";

const meta = {
  title: "Checkbox",
  component: CheckboxStoryComponent,
  decorators: [],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof CheckboxStoryComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select your option",
    checkboxes: [
      { value: "checkbox1", label: "Checkbox 1" },
      { value: "checkbox2", label: "Checkbox 2 Lorem ipsum dolor sit amet" },
      { value: "checkbox3", label: "Checkbox 3", disabled: true },
    ],
  },
};

export const Optional: Story = {
  args: {
    label: "Select your option",
    optional: true,
    checkboxes: [
      { value: "checkbox1", label: "Checkbox 1" },
      { value: "checkbox2", label: "Checkbox 2 Lorem ipsum dolor sit amet" },
      { value: "checkbox3", label: "Checkbox 3", disabled: true },
    ],
  },
};

export const Controlled: Story = {
  args: {
    label: "Select your option",
    value: ["checkbox1", "checkbox2", "checkbox4", "checkbox5"],
    checkboxes: [
      { value: "checkbox1", label: "Checkbox 1" },
      {
        value: "checkbox2",
        label: "Checkbox 2 Lorem ipsum dolor sit amet",
        indeterminate: true,
      },
      { value: "checkbox3", label: "Checkbox 3" },
      { value: "checkbox4", label: "Checkbox 4", disabled: true },
      {
        value: "checkbox5",
        label: "Checkbox 5",
        indeterminate: true,
        disabled: true,
      },
      { value: "checkbox6", label: "Checkbox 6", disabled: true },
    ],
  },
};

export const NoLabel: Story = {
  args: {
    label: "Select your option",
    optional: true,
    checkboxes: [
      { value: "checkbox1", label: "Checkbox 1", showLabel: false },
      {
        value: "checkbox2",
        label: "Checkbox 2 Lorem ipsum dolor sit amet",
        showLabel: false,
      },
      {
        value: "checkbox3",
        label: "Checkbox 3",
        disabled: true,
        showLabel: false,
      },
    ],
  },
};

export const LabelOnLeft: Story = {
  args: {
    label: "Select your option",
    optional: true,
    labelPlacement: "top",

    checkboxes: [
      { value: "checkbox1", label: "Checkbox 1" },
      {
        value: "checkbox2",
        label: "Checkbox 2 with longer text",
      },
      {
        value: "checkbox3",
        label: "Checkbox 3",
        disabled: true,
      },
    ],
  },
};
