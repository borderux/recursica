import type { Meta, StoryObj } from "@storybook/react";
import { Title } from "./Title";
import { Layer } from "@recursica/adapter-common";

const meta: Meta<typeof Title> = {
  title: "UI-Kit/Title",
  component: Title,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The semantic `<Title>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally.",
      },
    },
  },
  argTypes: {
    order: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
      description:
        "Controls the `h` tag and the resultant typographical weighting natively mapped to Recursica.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Title>;

export const Default: Story = {
  args: {
    order: 1,
    children: "Semantic H1 Document Boundary",
  },
  render: ({ ...args }) => (
    <Layer layer={0} style={{ padding: "48px" }}>
      <Title {...args} />
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
      <Title order={1}>H1 Title</Title>
      <Title order={2}>H2 Title</Title>
      <Title order={3}>H3 Title</Title>
      <Title order={4}>H4 Title</Title>
      <Title order={5}>H5 Title</Title>
      <Title order={6}>H6 Title</Title>
    </Layer>
  ),
};
