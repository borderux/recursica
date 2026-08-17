import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layer } from "@recursica/adapter-common";

const meta: Meta<typeof Layer> = {
  title: "UI-Kit/Layer",
  component: Layer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Layer` binds a subtree to one of Recursica's four elevation layers (0-3) by setting `data-recursica-layer` on its root, which scopes the surface, border, and elevation CSS variables from `recursica_variables_scoped.css` to that subtree. `RecursicaThemeProvider` wraps the app in a `layer={0}` `Layer` automatically — wrap anything visually elevated above the page background (a Card, Modal, Popover, etc.) in its own `Layer`. This story itself is already rendered inside a `Layer`; use the global `layer`/`withLayer` Story Controls to preview that outer layer, and see below for composing additional nested layers.",
      },
    },
  },
  argTypes: {
    // `layer` here IS the same arg as the global `layer` Story Control (see preview.tsx) —
    // there's only one `layer` arg key, so a story-level override replaces the global one
    // rather than adding a "duplicate"; leave it undefined so the global inline-radio control
    // (already wired to this story's outer Layer wrapper) keeps working.
    contentsOnly: { control: false },
    children: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof Layer>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      This content sits directly on the layer applied by the story&apos;s outer{" "}
      <code>Layer</code> wrapper — use the <strong>layer</strong> and{" "}
      <strong>withLayer</strong> Story Controls to preview layers 0-3.
    </div>
  ),
};

export const NestedLayers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Layers compose by nesting: wrap progressively more elevated content in its own `Layer` to move up the elevation scale. Nesting `Layer`s is how Recursica communicates elevation to descendant components — never pass a `layer` prop directly to another component.",
      },
    },
  },
  render: () => (
    <Layer layer={1} style={{ padding: 24 }}>
      Layer 1
      <Layer layer={2} style={{ padding: 24, marginTop: 16 }}>
        Layer 2
        <Layer layer={3} style={{ padding: 24, marginTop: 16 }}>
          Layer 3
        </Layer>
      </Layer>
    </Layer>
  ),
};

export const ContentsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With `contentsOnly`, `Layer` renders with `display: contents` and omits `data-recursica-layer` entirely — no extra DOM box, no layer styling. Use this for a purely structural layer boundary in the component tree.",
      },
    },
  },
  render: () => (
    <Layer layer={1} contentsOnly>
      <div style={{ border: "1px dashed currentColor", padding: 24 }}>
        This box comes from a plain child <code>div</code>, not{" "}
        <code>Layer</code> itself — with <code>contentsOnly</code>,{" "}
        <code>Layer</code> renders no box of its own and applies no layer
        styling.
      </div>
    </Layer>
  ),
};
