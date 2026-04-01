import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layer } from "./Layer";
import { Button } from "../Button/Button";

const layerStyle = { padding: 20 };

const meta: Meta<typeof Layer> = {
  component: Layer,
  title: "Design System/Layer",
  argTypes: {
    layer: {
      control: "select",
      options: [0, 1, 2, 3],
      description:
        "Layer (0–3) applied to descendants via data-recursica-layer",
    },
    children: {
      control: false,
      description: "Content that receives the layer context",
    },
  },
  args: {
    layer: 1,
    children: null,
  },
};

export default meta;

type Story = StoryObj<typeof Layer>;

/** All four layers side by side. */
export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Layer layer={0} style={layerStyle}>
        <Button>Layer 0</Button>
      </Layer>
      <Layer layer={1} style={layerStyle}>
        <Button>Layer 1</Button>
      </Layer>
      <Layer layer={2} style={layerStyle}>
        <Button>Layer 2</Button>
      </Layer>
      <Layer layer={3} style={layerStyle}>
        <Button>Layer 3</Button>
      </Layer>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/** Playground: change layer to see Button (and other descendants) use that layer's styles. */
export const SingleLayer: Story = {
  render: (args) => (
    <Layer {...args} style={layerStyle}>
      <Button>Button in layer {args.layer}</Button>
    </Layer>
  ),
};

/*
 * Static stories: one per layer with padding on the Layer div and a default Button.
 */
export const Layer0: Story = {
  args: { layer: 0 },
  render: (args) => (
    <Layer {...args} style={layerStyle}>
      <Button>Layer 0</Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

export const Layer1: Story = {
  args: { layer: 1 },
  render: (args) => (
    <Layer {...args} style={layerStyle}>
      <Button>Layer 1</Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

export const Layer2: Story = {
  args: { layer: 2 },
  render: (args) => (
    <Layer {...args} style={layerStyle}>
      <Button>Layer 2</Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};

export const Layer3: Story = {
  args: { layer: 3 },
  render: (args) => (
    <Layer {...args} style={layerStyle}>
      <Button>Layer 3</Button>
    </Layer>
  ),
  parameters: { controls: { disable: true } },
};
