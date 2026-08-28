import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "UI-Kit/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The semantic `<Heading>` abstraction intrinsically links pure `h1-h6` tag generation with exact Recursica design boundaries to preserve SEO and screen reader trees uniformly globally.",
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

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    order: 1,
    children: "Semantic H1 Document Boundary",
  },
  render: ({ ...args }) => <Heading {...args} />,
};

export const StaticVariations: Story = {
  args: {},
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Heading order={1}>H1 Heading</Heading>
      <Heading order={2}>H2 Heading</Heading>
      <Heading order={3}>H3 Heading</Heading>
      <Heading order={4}>H4 Heading</Heading>
      <Heading order={5}>H5 Heading</Heading>
      <Heading order={6}>H6 Heading</Heading>
    </div>
  ),
};
