import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "UI-Kit/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Heading>` instead.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "body",
        "body-small",
        "caption",
        "overline",
        "subtitle",
        "subtitle-small",
      ],
      description:
        "Controls the standard logical boundary definitions natively extracted from Figma.",
    },
    emphasis: {
      control: "inline-radio",
      options: ["high", "low"],
      description:
        "Text opacity level. `high` (default) is fully opaque; `low` dims the text without changing its color, so it is safe on any layer.",
    },
    state: {
      control: "inline-radio",
      options: [undefined, "success", "alert", "warning"],
      description:
        "Semantic text color. When unset, the text inherits the surrounding layer color. Composes with `emphasis`.",
    },
    c: {
      control: "text",
      description:
        "Standard Mantine color string mapped via internal boundaries. Example: `dimmed`",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    variant: "body",
    children:
      "This is standard body typography controlled by the central UI-kit boundaries exclusively.",
  },
  render: ({ ...args }) => <Text {...args} />,
};

export const StaticVariations: Story = {
  args: {},
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Text variant="body">
        Body (Base paragraph and generic information flow)
      </Text>
      <Text variant="body-small">
        Body Small (Compacted list items and helper blocks)
      </Text>
      <Text variant="caption">
        Caption (Data table descriptions or micro-labels)
      </Text>
      <Text variant="overline">
        Overline (Card contextual pre-headers and categorical tags)
      </Text>
      <Text variant="subtitle">
        Subtitle (Minor sub-headers avoiding heavy display weights)
      </Text>
      <Text variant="subtitle-small">
        Subtitle Small (Section anchors deep in hierarchy)
      </Text>
    </div>
  ),
};

export const EmphasisAndState: Story = {
  args: {},
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Text emphasis="high">Emphasis high (default) — fully opaque</Text>
      <Text emphasis="low">Emphasis low — same color, dimmed opacity</Text>
      <Text state="success">State success — semantic success color</Text>
      <Text state="alert">State alert — semantic alert color</Text>
      <Text state="warning">State warning — semantic warning color</Text>
    </div>
  ),
};
