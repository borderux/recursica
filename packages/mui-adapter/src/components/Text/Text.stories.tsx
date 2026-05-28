import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";
import { Layer } from "@recursica/adapter-common";

const meta: Meta<typeof Text> = {
  title: "UI-Kit/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The standard `<Text>` component controls common body sizing scales and implicit paragraphs governed by the active theme layer. For semantic headings (`h1` through `h6`), use `<Title>` instead.",
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
  render: ({ ...args }) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <Text {...args} />
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
        gap: "16px",
      }}
    >
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
    </Layer>
  ),
};
