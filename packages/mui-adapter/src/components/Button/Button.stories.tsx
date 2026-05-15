import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Layer } from "@recursica/adapter-common";

type ButtonStoryProps = React.ComponentProps<typeof Button>;

const meta: Meta<ButtonStoryProps> = {
  title: "UI-Kit/Button",
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
    loading: {
      control: "boolean",
      description: "Sets the button to a loading state",
    },
    useRecursicaLoader: {
      control: "boolean",
      description:
        "Use the Recursica Loader component instead of the default Mantine loader",
    },
    loaderVariant: {
      control: "select",
      options: ["oval", "bars", "dots"],
      description: "The visual variant of the Recursica Loader",
    },
    loaderSize: {
      control: "select",
      options: [undefined, "sm", "md", "lg", "small", "default", "large"],
      description: "The size variant for the loader",
    },
  },
  args: {
    useRecursicaLoader: true,
    loaderVariant: "oval",
    loaderSize: undefined,
  },
  parameters: {
    controls: {
      include: [
        "layer",
        "withLayer",
        "variant",
        "size",
        "children",
        "component",
        "icon",
        "disabled",
        "href",
        "onClick",
        "onChange",
        "value",
        "checked",
        "loading",
        "useRecursicaLoader",
        "loaderVariant",
        "loaderSize",
      ],
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
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({ withLayer, layer, ...args }: any) => {
    return <Button {...args} />;
  },
};

export const SolidDefault: Story = {
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default",
  },
};

export const OutlineSmall: Story = {
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small",
  },
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
};

export const LayerOneSolid: Story = {
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default",
  },
  render: (args: ButtonStoryProps) => (
    <Layer layer={1} style={{ padding: "24px" }}>
      <Button {...args} />
    </Layer>
  ),
};

export const DisabledSolid: Story = {
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true,
  },
};

export const PolymorphicAsLink: Story = {
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank",
  },
};

export const TruncatedLabel: Story = {
  args: {
    children:
      "This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",
    variant: "solid",
    size: "default",
  },
  render: (args: ButtonStoryProps) => (
    <div style={{ maxWidth: "250px" }}>
      <Button {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: "Saving Changes",
    variant: "solid",
    size: "default",
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `loading={true}` is applied, the Button injects the Recursica `<Loader />` component. Per Recursica design rules, placing a Button in a loading state automatically forces the `disabled={true}` state on the underlying element. This ensures the button immediately receives the brand theme disabled opacities without relying solely on semantic logic.",
      },
    },
  },
};
