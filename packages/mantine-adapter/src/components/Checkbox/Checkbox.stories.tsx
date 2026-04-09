import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Layer } from "@recursica/adapter-common";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "UI-Kit/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Checkbox\` component is a precisely engineered, atomic form primitive representing boolean states natively aligned to the Recursica design system. It overrides Mantine's standard properties explicitly enforcing our variables natively across all structural boundaries.

### Usage
To render a solitary component natively:
\`\`\`tsx
<Checkbox label="Acknowledge Terms" defaultChecked />
\`\`\`

### Using within Arrays (Checkbox.Group)
When wrapping multiple Checkbox elements together, **always** utilize the \`<Checkbox.Group>\` component. This automatically inherits the global \`FormControlWrapper\` natively granting instantaneous access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.

We exclusively utilize the \`formLayout\` parameter to control macro-level form flow:
- **\`formLayout="stacked"\`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked checkbox column array.
- **\`formLayout="side-by-side"\`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal checkboxes cleanly alongside it horizontally.

\`\`\`tsx
<Checkbox.Group 
  label="Execution Targets" 
  assistiveText="Strictly mapped structural grouping dynamically applied natively."
  formLayout="stacked" 
>
  <Checkbox value="react" label="Browser Execution Context" />
  <Checkbox value="svelte" label="Edge Nodes" />
</Checkbox.Group>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    readOnly: {
      control: "boolean",
      description:
        "Toggles structural read-only data presentation bypassing interaction boundaries completely.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Standard Unchecked Property",
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <Checkbox {...args} />
    </Layer>
  ),
};

export const LongLabelWrap: Story = {
  args: {
    label:
      "A meticulously long Checkbox label property demonstrating the absolute maximum 400px wrapper constraints actively snapping the text engine down onto a secondary wrapping line automatically without blowing out the visual boundaries.",
  },
  render: (args) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <Checkbox {...args} />
    </Layer>
  ),
};

export const StaticVariations: Story = {
  args: {},
  render: () => (
    <Layer
      layer={0}
      style={{
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Checkbox label="Default Unchecked State" />
      <Checkbox label="Acknowledge Configuration" defaultChecked />
      <Checkbox label="Indeterminate Master" indeterminate />
      <Checkbox label="Disabled Variant" disabled />
      <Checkbox label="Disabled Checked Variant" checked disabled />
    </Layer>
  ),
};

export const GroupSideBySide: Story = {
  render: function GroupSideBySideRender() {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <Layer layer={0} style={{ padding: "48px" }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          label="Frontend Frameworks"
          assistiveText="Select all libraries currently in use for this specific workspace configuration."
          formLayout="side-by-side"
          labelOptionalText="Recommended"
          labelWithEditIcon
        >
          <Checkbox value="react" label="React (Standard Build)" />
          <Checkbox
            value="svelte"
            label="The Svelte architecture which provides a highly optimized, completely compiler-driven framework avoiding virtual DOM boundaries. This massively extended text explicitly guarantees accurate wrapper constraint checking and multi-line flex alignment."
          />
          <Checkbox value="vue" label="Vue Configuration Map" />
        </Checkbox.Group>
      </Layer>
    );
  },
};

export const GroupStacked: Story = {
  render: function GroupStackedRender() {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <Layer layer={0} style={{ padding: "48px" }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          label="Execution Targets"
          error="You must select at least one deployment target to compile."
          required
          formLayout="stacked"
        >
          <Checkbox value="react" label="Browser Execution Context" />
          <Checkbox
            value="svelte"
            label="Highly distributed Edge computing environments seamlessly bridging local runtime boundaries."
          />
          <Checkbox value="vue" label="Serverless Cloud Providers" />
        </Checkbox.Group>
      </Layer>
    );
  },
};

export const StaticReadOnlyGroup: Story = {
  render: function StaticReadOnlyGroupRender() {
    const [value, setValue] = useState<string[]>(["disabledNode"]);
    return (
      <Layer layer={0} style={{ padding: "48px" }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          label="Static ReadOnly Execution Locks"
          assistiveText="This structure explicitly validates native component-level DOM preservation natively mapping lock bounds safely over interaction."
          required
          readOnly
          formLayout="stacked"
        >
          <Checkbox
            value="disabledNode"
            label="Structurally Checked Node natively"
          />
          <Checkbox
            value="disabledNodeEmpty"
            label="Unchecked Configuration Limit"
          />
        </Checkbox.Group>
      </Layer>
    );
  },
};

export const EditableReadOnlyGroup: Story = {
  render: function EditableReadOnlyGroupRender() {
    const [value, setValue] = useState<string[]>(["activeState"]);
    return (
      <Layer layer={0} style={{ padding: "48px" }}>
        <Checkbox.Group
          value={value}
          onChange={setValue}
          label="Interactively Editable ReadOnly Group"
          assistiveText="Users explicitly unlock DOM structures dynamically."
          labelWithEditIcon
          readOnly
          formLayout="side-by-side"
        >
          <Checkbox value="activeState" label="Locked active state" />
          <Checkbox value="unlockedNode" label="Locked inactive map" />
        </Checkbox.Group>
      </Layer>
    );
  },
};
