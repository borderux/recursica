import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";
import { useState } from "react";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof CheckboxGroup> = {
  title: "UI-Kit/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`CheckboxGroup\` component is the mandatory organizational wrapper aggregating multiple \`Checkbox\` primitives into structurally bound unified arrays. It inherently leverages the \`FormControlWrapper\` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.

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
    ...formControlArgTypes,
    readOnly: {
      control: "boolean",
      description:
        "Toggles structural read-only data presentation bypassing interaction boundaries completely.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

export const GroupSideBySide: Story = {
  args: {
    formLayout: "side-by-side",
    labelOptionalText: "Recommended",
    labelWithEditIcon: true,
    label: "Frontend Frameworks",
    assistiveText:
      "Select all libraries currently in use for this specific workspace configuration.",
  },
  render: function GroupSideBySideRender(args) {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="react" label="React (Standard Build)" />
        <Checkbox
          value="svelte"
          label="The Svelte architecture which provides a highly optimized, completely compiler-driven framework avoiding virtual DOM boundaries. This massively extended text explicitly guarantees accurate wrapper constraint checking and multi-line flex alignment."
        />
        <Checkbox value="vue" label="Vue Configuration Map" />
      </Checkbox.Group>
    );
  },
};

export const GroupStacked: Story = {
  args: {
    formLayout: "stacked",
    required: true,
    label: "Execution Targets",
    error: "You must select at least one deployment target to compile.",
  },
  render: function GroupStackedRender(args) {
    const [value, setValue] = useState<string[]>(["react"]);
    return (
      <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="react" label="Browser Execution Context" />
        <Checkbox
          value="svelte"
          label="Highly distributed Edge computing environments seamlessly bridging local runtime boundaries."
        />
        <Checkbox value="vue" label="Serverless Cloud Providers" />
      </Checkbox.Group>
    );
  },
};

export const StaticReadOnlyGroup: Story = {
  args: {
    readOnly: true,
    formLayout: "stacked",
    required: true,
    label: "Static ReadOnly Execution Locks",
    assistiveText:
      "This structure explicitly validates native component-level DOM preservation natively mapping lock bounds safely over interaction.",
  },
  render: function StaticReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string[]>(["disabledNode"]);
    return (
      <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox
          value="disabledNode"
          label="Structurally Checked Node natively"
        />
        <Checkbox
          value="disabledNodeEmpty"
          label="Unchecked Configuration Limit"
        />
      </Checkbox.Group>
    );
  },
};

export const EditableReadOnlyGroup: Story = {
  args: {
    readOnly: true,
    formLayout: "side-by-side",
    labelWithEditIcon: true,
    label: "Interactively Editable ReadOnly Group",
    assistiveText: "Users explicitly unlock DOM structures dynamically.",
  },
  render: function EditableReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string[]>(["activeState"]);
    return (
      <Checkbox.Group {...args} value={value} onChange={setValue}>
        <Checkbox value="activeState" label="Locked active state" />
        <Checkbox value="unlockedNode" label="Locked inactive map" />
      </Checkbox.Group>
    );
  },
};
