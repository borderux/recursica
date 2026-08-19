import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TransferList } from "./TransferList";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

type TransferListStoryProps = React.ComponentProps<typeof TransferList>;

const SAMPLE_DATA: TransferListStoryProps["defaultData"] = [
  [
    { value: "alpha", label: "Alpha" },
    { value: "bravo", label: "Bravo" },
    { value: "charlie", label: "Charlie" },
    { value: "delta", label: "Delta" },
    { value: "echo", label: "Echo" },
  ],
  [{ value: "foxtrot", label: "Foxtrot" }],
];

const GROUPED_DATA: TransferListStoryProps["defaultData"] = [
  [
    { value: "apple", label: "Apple", group: "Fruit" },
    { value: "banana", label: "Banana", group: "Fruit" },
    { value: "carrot", label: "Carrot", group: "Vegetable" },
    { value: "daikon", label: "Daikon", group: "Vegetable" },
    { value: "eagle", label: "Eagle" },
  ],
  [],
];

const meta: Meta<TransferListStoryProps> = {
  title: "UI-Kit/TransferList",
  component: TransferList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "TransferList (dual listbox) lets users move items between two lists. Composes FormControlWrapper, TextField, Checkbox, CheckboxGroup, Badge, and Button.",
      },
    },
  },
  args: {
    label: "Assign users",
    assistiveText: "Move users into the selected list.",
    defaultData: SAMPLE_DATA,
    disabled: false,
    required: false,
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    ...formControlArgTypes,
    sourceLabel: {
      control: "text",
    },
    targetLabel: {
      control: "text",
    },
    searchable: {
      control: "boolean",
    },
    searchPlaceholder: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<TransferListStoryProps>;

export const Default: Story = {};

export const Grouped: Story = {
  args: {
    label: "Assign ingredients",
    defaultData: GROUPED_DATA,
  },
};

export const SideBySide: Story = {
  args: {
    formLayout: "side-by-side",
  },
};

export const NoSearch: Story = {
  args: {
    label: "Assign users (no filtering)",
    searchable: false,
  },
};

export const StaticError: Story = {
  args: {
    error: "Select at least one user.",
    defaultData: [[], SAMPLE_DATA![0]],
  },
};

export const StaticDisabled: Story = {
  args: {
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    label: "Assign users",
    defaultData: [[], []],
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Assigned users",
    defaultData: [[], SAMPLE_DATA![0]],
    readOnly: true,
  },
};
