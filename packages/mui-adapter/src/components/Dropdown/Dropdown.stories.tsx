import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";
import { renderRichOptionContent } from "../../utils/renderRichOption";
import styles from "./Dropdown.module.css";

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
    clearable: {
      control: "boolean",
    },
    wrapItemText: {
      control: "boolean",
      description:
        "Wraps option label/supportingText onto additional lines instead of truncating with an ellipsis.",
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

export const Clearable: Story = {
  args: {
    label: "Clearable Options",
    clearable: true,
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

const UserIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const WithRichOptions: Story = {
  args: {
    label: "Assignee",
    placeholder: "Pick a team member",
    assistiveText:
      "Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md.",
    data: [
      {
        value: "jdoe",
        label: "Jane Doe",
        leadingIcon: UserIcon,
        supportingText: "jane.doe@example.com",
      },
      {
        value: "asmith",
        label: "Alex Smith",
        leadingIcon: UserIcon,
        supportingText: "alex.smith@example.com",
      },
      { value: "unassigned", label: "Unassigned" },
    ],
  },
};

export const WithRichOptionsWrapped: Story = {
  args: {
    label: "Assignee",
    placeholder: "Pick a team member",
    wrapItemText: true,
    data: [
      {
        value: "jdoe",
        label: "Jane Doe, Senior Staff Engineer, Platform Infrastructure",
        leadingIcon: UserIcon,
        supportingText:
          "jane.doe@example.com — Platform Infrastructure team, on-call rotation lead",
      },
      { value: "unassigned", label: "Unassigned" },
    ],
    assistiveText:
      "wrapItemText=true — long label/supportingText wrap instead of truncating.",
  },
};

const optionRowPreviewClassNames = {
  optionContent: styles.optionContent,
  optionIcon: styles.optionIcon,
  optionText: styles.optionText,
  optionTextWrap: styles.optionTextWrap,
  optionSupportingText: styles.optionSupportingText,
};

const OPTION_ROW_PREVIEW_ITEMS = [
  {
    value: "icon-and-supporting",
    label: "Jane Doe",
    leadingIcon: UserIcon,
    supportingText: "jane.doe@example.com",
  },
  {
    value: "no-icon",
    label: "Alex Smith",
    supportingText:
      "No leadingIcon — label/supportingText shift left, no reserved icon space",
  },
  {
    value: "no-supporting-text",
    label: "Taylor Rivera",
    leadingIcon: UserIcon,
  },
  {
    value: "plain",
    label: "Plain option — no leadingIcon, no supportingText",
  },
  {
    value: "long-text",
    label:
      "A very long option label that, with wrapItemText, wraps onto a second line instead of overflowing the fixed-width dropdown — otherwise it truncates with an ellipsis",
    leadingIcon: UserIcon,
    supportingText:
      "A similarly long supporting text string, to confirm the same wrap-or-truncate behavior applies to it too",
  },
];

// Renders the option row content directly — outside the MUI Menu portal — inside a container
// sized to Dropdown's own max-width token. Spacing between rows, icon/supportingText presence-
// or-absence alignment, and long-text wrapping/truncation are all much easier to inspect this way
// than by opening the real (portal-rendered) MUI Select menu. See
// MANTINE_ADAPTER_RICH_OPTION_DATA.md.
const renderOptionRowPreview = (wrapItemText: boolean) => (
  <div
    className={styles.dropdown}
    style={{
      width:
        "var(--recursica_ui-kit_components_dropdown_variants_layouts_stacked_properties_max-width)",
    }}
  >
    {OPTION_ROW_PREVIEW_ITEMS.map((item) => (
      <div key={item.value} className={styles.option}>
        {renderRichOptionContent(
          item,
          optionRowPreviewClassNames,
          wrapItemText,
        )}
      </div>
    ))}
  </div>
);

// Default: `wrapItemText` is false — label/supportingText truncate to a single line with an
// ellipsis instead of wrapping.
export const RichOptionRowPreview: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => renderOptionRowPreview(false),
};

// `wrapItemText: true` — label/supportingText wrap onto additional lines instead of truncating.
export const RichOptionRowPreviewWrapped: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => renderOptionRowPreview(true),
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
