import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./Autocomplete";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof Autocomplete> = {
  title: "UI-Kit/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Autocomplete\` primitive provides a text input with a dropdown menu for displaying suggestions as the user types.

### Architectural Decoupling
Recursica wraps the internal Mantine \`<Autocomplete>\` component inside the \`WithReadOnlyWrapper\`, ensuring it integrates perfectly with the strict design system form architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<Autocomplete 
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
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

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

export const Docs: Story = {
  args: {
    label: "Documentation Mode",
    placeholder: "Docs layout validation...",
    data: ["Doc A", "Doc B"],
    assistiveText: "Explicitly requested docs story.",
  },
};
