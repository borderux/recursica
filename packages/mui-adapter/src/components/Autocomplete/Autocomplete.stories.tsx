import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete as AutoComplete } from "./Autocomplete";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";
import { renderRichOptionContent } from "../../utils/renderRichOption";
import styles from "./Autocomplete.module.css";

const meta: Meta<typeof AutoComplete> = {
  title: "UI-Kit/AutoComplete",
  component: AutoComplete,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`AutoComplete\` primitive provides a text input with a dropdown menu for displaying suggestions as the user types.

### Architectural Decoupling
Recursica wraps the internal Mantine \`<Autocomplete>\` component inside the \`WithReadOnlyWrapper\`, ensuring it integrates perfectly with the strict design system form architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<AutoComplete 
  label="Country" 
  assistiveText="Select your country of residence." 
  data={["United States", "Canada", "Mexico", "United Kingdom", "France"]}
  formLayout="stacked" 
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    ...formControlArgTypes,
    disabled: {
      control: "boolean",
      description:
        "Maps the formal disabled variable states structurally to the input core.",
    },
    error: {
      control: "text",
      description:
        "Applies the strict error string boundary rendering invalid structures seamlessly.",
    },
    required: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    assistiveText: {
      control: "text",
    },
    readOnly: {
      control: "boolean",
      description:
        "Toggles structural read-only data presentation explicitly blocking standard component bindings.",
    },
    wrapItemText: {
      control: "boolean",
      description:
        "Wraps option label/supportingText onto additional lines instead of truncating with an ellipsis.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AutoComplete>;

export const Default: Story = {
  args: {
    disabled: false,
    readOnly: false,
    label: "Country Selection",
    placeholder: "Start typing...",
    data: [
      "United States",
      "Canada",
      "Mexico",
      "United Kingdom",
      "France",
      "Germany",
      "Japan",
      "Brazil",
      "India",
      "Australia",
    ],
    assistiveText: "Search from a predefined list of countries.",
  },
};

export const FormsSideBySide: Story = {
  args: {
    label: "Primary Region",
    placeholder: "Select region...",
    data: ["US-East", "US-West", "EU-Central", "AP-South", "SA-East"],
    assistiveText:
      "Select the primary region for the deployment. This violently long string tests native textual wrapping safely mapping alongside inputs.",
    formLayout: "side-by-side",
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Search Projects",
    placeholder: "Project name...",
    data: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
    leftSection: (
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
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: "Validation URL",
    placeholder: "https://recursica.dev",
    data: [
      "https://recursica.dev",
      "https://beta.recursica.dev",
      "https://api.recursica.dev",
    ],
    rightSection: (
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
        <polyline points="20 6 9 17 4 12"></polyline>
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
    placeholder: "Search team members...",
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
    assistiveText:
      "Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md.",
  },
};

export const WithRichOptionsWrapped: Story = {
  args: {
    label: "Assignee",
    placeholder: "Search team members...",
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

// Renders the option row content directly — outside the MUI Popper portal — inside a container
// sized to Autocomplete's own max-width token. Spacing between rows, icon/supportingText
// presence-or-absence alignment, and long-text wrapping/truncation are all much easier to inspect
// this way than by opening the real (portal-rendered) MUI Autocomplete listbox. See
// MANTINE_ADAPTER_RICH_OPTION_DATA.md.
const renderOptionRowPreview = (wrapItemText: boolean) => (
  <div
    className={styles.dropdown}
    style={{
      width:
        "var(--recursica_ui-kit_components_autocomplete_variants_layouts_stacked_properties_max-width)",
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

export const Disabled: Story = {
  args: {
    label: "Disabled Deployment Node",
    placeholder: "Disabled primitive map...",
    data: ["Node 1", "Node 2", "Node 3"],
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Cluster Failure",
    placeholder: "Failing component instance...",
    data: ["Cluster A", "Cluster B", "Cluster C"],
    defaultValue: "Invalid Cluster",
    error:
      "Critical runtime node disconnect detected traversing DOM architecture.",
    required: true,
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    data: ["Option 1", "Option 2"],
    value: "Explicitly Uneditable Bound Output",
    readOnly: true,
  },
};

export const EditableReadOnly: Story = {
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    data: ["Option 1", "Option 2"],
    defaultValue: "Waiting for Edit Execution",
    readOnly: true,
    labelWithEditIcon: true,
  },
};
