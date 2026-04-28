import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";
import { useState } from "react";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof RadioGroup> = {
  title: "UI-Kit/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`RadioGroup\` component is the mandatory organizational wrapper aggregating multiple \`Radio\` primitives into structurally bound unified selection arrays. It inherently leverages the \`FormControlWrapper\` granting native access to macroscopic layout structuring, assistive descriptions, and strict flex arrays.

We exclusively utilize the \`formLayout\` parameter to control macro-level form flow:
- **\`formLayout="stacked"\`**: Top-to-bottom layout cascading the Label bounding box down vertically into a standard stacked radio column array.
- **\`formLayout="side-by-side"\`**: Flow architecture pulling the grouping Label dynamically to the left while structurally organizing the internal radios cleanly alongside it horizontally.
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

type Story = StoryObj<typeof RadioGroup>;

export const GroupStacked: Story = {
  args: {
    formLayout: "stacked",
    required: true,
    label: "Hosting Provider",
    error: "You must select a deployment provider.",
  },
  render: function GroupStackedRender(args) {
    const [value, setValue] = useState<string>("aws");
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="aws" label="Amazon Web Services" />
        <Radio
          value="gcp"
          label="Google Cloud Platform (with completely distributed edge computing environments bridging local runtime boundaries seamlessly.)"
        />
        <Radio value="azure" label="Microsoft Azure" />
      </RadioGroup>
    );
  },
};

export const GroupSideBySide: Story = {
  args: {
    formLayout: "side-by-side",
    labelOptionalText: "Recommended",
    labelWithEditIcon: true,
    label: "Deployment Region",
    assistiveText: "Select the data center closest to your user base.",
  },
  render: function GroupSideBySideRender(args) {
    const [value, setValue] = useState<string>("us-east");
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="us-east" label="US East (N. Virginia)" />
        <Radio value="us-west" label="US West (Oregon)" />
        <Radio value="eu-central" label="EU Central (Frankfurt)" />
      </RadioGroup>
    );
  },
};

export const StaticReadOnlyGroup: Story = {
  args: {
    readOnly: true,
    formLayout: "stacked",
    required: true,
    label: "Selected Framework",
    assistiveText: "This selection cannot be changed after initialization.",
    readOnlyComponent: <span>React (Standard Build)</span>,
  },
  render: function StaticReadOnlyGroupRender(args) {
    const [value, setValue] = useState<string>("react");
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radio value="react" label="React" />
        <Radio value="vue" label="Vue" />
      </RadioGroup>
    );
  },
};
