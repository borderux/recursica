import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Layer } from "@recursica/adapter-common";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "UI-Kit/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
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

export const GroupLayouts = () => {
  const [value, setValue] = useState<string[]>(["react"]);

  return (
    <Layer
      layer={0}
      style={{
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      <div>
        <h4
          style={{
            margin: "0 0 16px 0",
            color: "var(--recursica_brand_typography_subtitle_color)",
          }}
        >
          Stacked Layout Array Tracker
        </h4>
        <Checkbox.Group value={value} onChange={setValue} layout="stacked">
          <Checkbox value="react" label="React" />
          <Checkbox value="svelte" label="Svelte" />
          <Checkbox value="vue" label="Vue" />
        </Checkbox.Group>
      </div>

      <div>
        <h4
          style={{
            margin: "0 0 16px 0",
            color: "var(--recursica_brand_typography_subtitle_color)",
          }}
        >
          Side-By-Side Layout Matrix
        </h4>
        <Checkbox.Group value={value} onChange={setValue} layout="side-by-side">
          <Checkbox value="react" label="React" />
          <Checkbox value="svelte" label="Svelte" />
          <Checkbox value="vue" label="Vue" />
        </Checkbox.Group>
      </div>
    </Layer>
  );
};
