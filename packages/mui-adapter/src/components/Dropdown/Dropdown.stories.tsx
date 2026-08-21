import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

type DropdownStoryProps = React.ComponentProps<typeof Dropdown>;

const meta: Meta<DropdownStoryProps> = {
  title: "UI-Kit/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown provides a selectable list of options, mapping natively over Mantine's Select component encapsulated within the standardized FormControlWrapper.",
      },
    },
  },
  args: {
    label: "Country Selection",
    assistiveText: "Select your country of origin.",
    placeholder: "Pick value",
    data: ["United States", "Canada", "Mexico", "United Kingdom", "France"],
    disabled: false,
    required: false,
    readOnly: false,
    searchable: false,
    clearable: false,
  },
  argTypes: {
    disabled: {
      control: "boolean",
    },
    ...formControlArgTypes,
    readOnly: {
      control: "boolean",
    },
    searchable: {
      control: "boolean",
    },
    clearable: {
      control: "boolean",
    },
    containerWidth: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<DropdownStoryProps>;

export const Default: Story = {
  args: {},
};

export const SearchableClearable: Story = {
  args: {
    label: "Search & Clear Options",
    searchable: true,
    clearable: true,
    placeholder: "Start typing...",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Destination",
    startAdornment: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
};

export const StaticError: Story = {
  args: {
    error: "You must choose a valid destination.",
    value: "Invalid Island",
  },
};

export const StaticDisabled: Story = {
  args: {
    disabled: true,
    value: "United States",
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "Read Only View",
    readOnly: true,
    value: "Canada",
  },
};
