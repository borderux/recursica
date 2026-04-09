import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Layer } from "@recursica/adapter-common";
import { Button } from "../Button/Button";

const meta: Meta<typeof Card> = {
  title: "UI-Kit/Card",
  component: Card,
  subcomponents: {
    "Card.Header": Card.Header,
    "Card.Content": Card.Content,
    "Card.Footer": Card.Footer,
    "Card.Section": Card.Section,
  } as Record<string, React.ComponentType<unknown>>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections.",
      },
    },
  },
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {},
  render: ({ ...args }) => {
    return (
      <Layer
        layer={0}
        style={{
          padding: "48px",
          backgroundColor: "var(--recursica_brand_palettes_neutral_050)",
        }}
      >
        <Card {...args}>
          <Card.Header>
            <span style={{ fontWeight: 500, fontSize: "1.125rem" }}>
              Customer Activity Report
            </span>
          </Card.Header>
          <Card.Content>
            <p>
              Card inner section content body. Notice how this acts as padded
              content natively based on the overarching properties. Recursica's
              vertical gutter governs vertical spacing between siblings in the
              flex container.
            </p>
            <p>Another section showing the vertical gutter spacing.</p>
          </Card.Content>
          <Card.Footer>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#868e96", fontSize: "0.75rem" }}>
                Generated today
              </span>
              <Button variant="solid">View Details</Button>
            </div>
          </Card.Footer>
        </Card>
      </Layer>
    );
  },
};

export const HeaderlessAndFooterless: Story = {
  args: {},
  render: ({ ...args }) => {
    return (
      <Layer
        layer={0}
        style={{
          padding: "48px",
          backgroundColor: "var(--recursica_brand_palettes_neutral_050)",
        }}
      >
        <Card {...args}>
          <Card.Content>
            <span style={{ fontWeight: 500, fontSize: "1.125rem" }}>
              Notice
            </span>
            <p>
              This is a completely generic card payload dropping the Header and
              Footer specific elements, simply acting as a padded elevation
              boundary box directly mirroring native composability!
            </p>
            <Button variant="solid" mt="rec-md">
              Acknowledge
            </Button>
          </Card.Content>
        </Card>
      </Layer>
    );
  },
};

export const LayerDemonstration: Story = {
  args: {},
  render: ({ ...args }) => {
    return (
      <div
        style={{
          display: "flex",
          gap: "32px",
          backgroundColor: "#e9ecef",
          padding: "32px",
        }}
      >
        <Layer layer={1}>
          <Card {...args}>
            <Card.Header>Layer 1 Wrapper</Card.Header>
            <p>Content inside layer 1 card.</p>
          </Card>
        </Layer>

        <Layer layer={2}>
          <Card {...args}>
            <Card.Header>Layer 2 Wrapper</Card.Header>
            <p>
              Content inside layer 2 card exposing a higher elevation drop
              shadow inherently cascaded.
            </p>
          </Card>
        </Layer>
      </div>
    );
  },
};
