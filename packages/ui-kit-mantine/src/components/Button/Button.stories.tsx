import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// A mock Layer component to satisfy the "wrap in <Layer>" requirement
// In the actual system, a real `<Layer>` might exist that provides this context.
const MockLayer = ({
  layer,
  children,
}: {
  layer: number;
  children: React.ReactNode;
}) => (
  <div
    data-recursica-layer={layer}
    style={{
      padding: "24px",
      backgroundColor:
        layer > 0
          ? "var(--recursica_ui-kit_themes_light_layer_1_ui-kit_globals_page_colors_background, #f5f5f5)"
          : "transparent",
      borderRadius: "8px",
    }}
  >
    {children}
  </div>
);

type ButtonStoryProps = React.ComponentProps<typeof Button> & {
  layer?: number;
};

const meta: Meta<ButtonStoryProps> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "text"],
      description: "The visual variant of the button",
    },
    size: {
      control: "radio",
      options: ["default", "small"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
    },
    // We add a 'layer' arg strictly for the story control, not passed to component
    layer: {
      control: "radio",
      options: [0, 1, 2, 3],
      description: "The design system layer context",
      table: {
        category: "Story Controls",
      },
    },
  },
};

export default meta;

type Story = StoryObj<ButtonStoryProps>;

export const Default: Story = {
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false,
    layer: 0, // default layer
  },
  render: ({ layer = 0, ...args }) => {
    return (
      <MockLayer layer={layer}>
        <Button {...args} />
      </MockLayer>
    );
  },
};

export const SolidDefault: Story = {
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default",
  },
  render: (args) => <Button {...args} />,
};

export const OutlineSmall: Story = {
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small",
  },
  render: (args) => <Button {...args} />,
};

export const TextWithIcon: Story = {
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
  render: (args) => <Button {...args} />,
};

export const LayerOneSolid: Story = {
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default",
  },
  render: (args) => (
    <MockLayer layer={1}>
      <Button {...args} />
    </MockLayer>
  ),
};

export const DisabledSolid: Story = {
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true,
  },
  render: (args) => <Button {...args} />,
};
