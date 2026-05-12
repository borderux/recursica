import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";

const meta: Meta<typeof Box> = {
  title: "UI-Kit/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `Box` component is the foundational layout primitive. It accepts all standard MUI layout properties (like `m`, `mt`, `p`, `px`, etc.), but natively intercepts **Recursica Spacing Tokens** (e.g., `rec-none`, `rec-sm`, `rec-default`, `rec-md`, `rec-lg`, `rec-xl`, `rec-2xl`). This allows developers to use Recursica's strict design tokens seamlessly alongside standard MUI spacing.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    children: "This is a standard Box",
    m: "20px",
  },
  render: (args) => (
    <Box
      {...args}
      style={{ border: "1px solid gray", padding: "10px" }}
      overStyled={true}
    />
  ),
};

export const WithRecursicaTokens: Story = {
  args: {
    children: "This Box uses Recursica layout tokens",
    m: "rec-xl",
    p: "rec-md",
  },
  render: (args) => (
    <div style={{ border: "1px dashed #ccc", display: "inline-block" }}>
      <Box
        {...args}
        style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        overStyled={true}
      />
    </div>
  ),
};

export const Polymorphic: Story = {
  args: {
    component: "section",
    children: "This Box is rendered as a <section> element",
    m: "rec-default",
    p: "rec-lg",
  },
};
