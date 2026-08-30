import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";
import { Layer } from "@recursica/adapter-common";

type LoaderStoryArgs = React.ComponentProps<typeof Loader> & {
  layer?: 0 | 1 | 2 | 3;
};

const meta: Meta<LoaderStoryArgs> = {
  title: "UI-Kit/Loader",
  component: Loader as React.ComponentType<LoaderStoryArgs>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Loader bridges the Recursica UI-Kit `loader` variables to the generic primitive, rendering deterministic sizes and variants visually mapped strictly from the explicit design boundary tokens.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["oval", "bars", "dots"],
      description: "The structural layout variant of the loading indicator",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "small", "default", "large"],
      description:
        "Scales the dimensional and thickness layout constrained to the explicit UI variables",
    },
    color: {
      control: "color",
      description:
        "Optional inline dynamic color override spanning the token defaults",
    },
    layer: {
      control: { type: "range", min: 0, max: 3, step: 1 },
      description:
        "Applies a wrapping context to observe rendering logic externally",
    },
    animate: {
      control: "boolean",
      description:
        "Freezes the CSS animation when false — deterministic, for visual regression",
    },
  },
};

export default meta;

type Story = StoryObj<LoaderStoryArgs>;

/**
 * Animated — excluded from visual regression (`adapter-tester.config.json`),
 * since a moving animation diffs differently every run. See the `Static*`
 * stories below for the deterministic, visual-regression-covered equivalents.
 */
export const Default: Story = {
  args: {
    variant: "oval",
    size: "default",
    layer: 0,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Layer layer={layer ?? 0} style={{ padding: "24px" }}>
      <Loader {...args} />
    </Layer>
  ),
};

/** `animate: false` freezes the spin — deterministic for visual regression. */
export const StaticOvalDefault: Story = {
  args: {
    variant: "oval",
    size: "default",
    animate: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Loader {...args} />,
};

/** `animate: false` freezes the bars — deterministic for visual regression. */
export const StaticBarsLarge: Story = {
  args: {
    variant: "bars",
    size: "large",
    animate: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Loader {...args} />,
};

/** `animate: false` freezes the dots — deterministic for visual regression. */
export const StaticDotsSmall: Story = {
  args: {
    variant: "dots",
    size: "sm",
    animate: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => <Loader {...args} />,
};

/**
 * Animated — excluded from visual regression, same as `Default`; this one
 * additionally demonstrates rendering inside a `layer={2}` context.
 */
export const LayerTwoOval: Story = {
  args: {
    variant: "oval",
    size: "default",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => (
    <Layer layer={2} style={{ padding: "24px" }}>
      <Loader {...args} />
    </Layer>
  ),
};
