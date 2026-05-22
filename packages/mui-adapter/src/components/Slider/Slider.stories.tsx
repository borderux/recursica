import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof Slider> = {
  title: "UI-Kit/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Slider\` component wraps Mantine's Slider to support a premium design system, a bidirectional input state, 
custom min/max labels, step indicators, and strict states like error, disabled, and read-only.

### Architecture
The component uses Recursica's unified \`FormControlWrapper\` and \`<WithReadOnlyWrapper>\` to render consistent form layouts (stacked, side-by-side) and read-only representations.
All visual properties map perfectly to token values inside \`Slider.module.css\`.
`,
      },
    },
  },
  argTypes: {
    ...formControlArgTypes,
    disabled: {
      control: "boolean",
      description: "Disables both the slider track and the text input field.",
    },
    error: {
      control: "text",
      description:
        "Places the slider in an error state with custom border/icon highlights.",
    },
    required: {
      control: "boolean",
    },
    label: {
      control: "text",
      description: "Outer form control label.",
    },
    assistiveText: {
      control: "text",
      description: "Assistive text rendered below or beside the component.",
    },
    readOnly: {
      control: "boolean",
      description: "Puts the component in static read-only mode.",
    },
    showInput: {
      control: "boolean",
      description: "Controls whether the numeric input box is visible.",
    },
    showMinMaxLabels: {
      control: "boolean",
      description: "Toggles rendering of min/max labels below the track.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    label: "Auditory Threshold",
    assistiveText: "Specify the maximum decibel frequency boundary.",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    showMinMaxLabels: true,
  },
};

export const WithInputField: Story = {
  args: {
    ...Default.args,
    showInput: true,
  },
};

export const SideBySideLayout: Story = {
  args: {
    ...Default.args,
    formLayout: "side-by-side",
  },
};

export const Disabled: Story = {
  args: {
    label: "Decommissioned Server Node",
    assistiveText: "Modifications to this environment are frozen.",
    defaultValue: 35,
    disabled: true,
  },
};

export const ErrorState: Story = {
  args: {
    label: "Core Temperature Alert",
    assistiveText:
      "Severe core degradation across the hypervisor socket cluster.",
    defaultValue: 85,
    error: "Thermal overload threshold exceeded.",
    required: true,
  },
};

export const StaticReadOnly: Story = {
  args: {
    label: "System Calibration Metrics",
    assistiveText:
      "Frozen baseline calibrations derived during initial staging.",
    value: 65,
    readOnly: true,
  },
};

export const EditableReadOnly: Story = {
  args: {
    label: "Adaptive Node Output",
    assistiveText:
      "Click edit to unlock bidirectional input parameter boundaries.",
    defaultValue: 15,
    readOnly: true,
    labelWithEditIcon: true,
  },
};

export const WithMarks: Story = {
  args: {
    label: "Interactive Marks Map",
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 10,
    marks: [
      { value: 0, label: "0%" },
      { value: 25, label: "25%" },
      { value: 50, label: "50%" },
      { value: 75, label: "75%" },
      { value: 100, label: "100%" },
    ],
    showMinMaxLabels: false,
  },
};

export const FormLayouts: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        maxWidth: 600,
      }}
    >
      <Slider
        label="Stacked Layout"
        assistiveText="This is the standard top-to-bottom stacked form layout."
        defaultValue={40}
        formLayout="stacked"
      />
      <Slider
        label="Side-by-Side Layout"
        assistiveText="This is the side-by-side layout aligning label beside control."
        defaultValue={60}
        formLayout="side-by-side"
      />
    </div>
  ),
};
