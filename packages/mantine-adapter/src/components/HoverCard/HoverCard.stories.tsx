import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "./HoverCard";
import { Button } from "../Button";
import { Text } from "../Text/Text";
import { Group } from "../Group/Group";
import { Stack } from "../Stack/Stack";
import { Avatar } from "../Avatar";

/**
 * HoverCard story axes:
 * - position: dropdown alignment relative to target
 * - withArrow: arrow indicator on the dropdown
 * - openDelay / closeDelay: hover timing controls
 * - content variations: plain text, rich content (avatar + text + actions)
 * - layer: tested via the global Layer decorator (withLayer/layer args)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HoverCardStoryArgs = Record<string, any>;

const meta: Meta = {
  title: "UI-Kit/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "bottom",
        "bottom-start",
        "bottom-end",
        "top",
        "top-start",
        "top-end",
        "left",
        "left-start",
        "left-end",
        "right",
        "right-start",
        "right-end",
      ],
      description: "The position of the dropdown relative to the target.",
    },
    withBeak: {
      control: "boolean",
      description:
        "Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow.",
    },
    offset: {
      control: "number",
      description:
        "Distance in px between the dropdown and the target element.",
    },
    openDelay: {
      control: "number",
      description: "Delay in ms before the dropdown opens on hover.",
    },
    closeDelay: {
      control: "number",
      description: "Delay in ms before the dropdown closes when hover ends.",
    },
    disabled: {
      control: "boolean",
      description: "If set, the hover card dropdown will not be rendered.",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`HoverCard\` component displays a popover-style dropdown when the user hovers over a target element. It wraps Mantine's composable \`HoverCard\` while enforcing strict Recursica design token styling.

### Composable API

HoverCard uses a dot-notation composition pattern:
- \`<HoverCard>\` — Root container managing open/close state on hover
- \`<HoverCard.Target>\` — Wrapper for the trigger element (must be a single element supporting ref)
- \`<HoverCard.Dropdown>\` — The popup panel displaying content on hover

### Key Behaviors
- The dropdown opens when the user hovers over the target and closes when they move away
- \`openDelay\` and \`closeDelay\` control the timing of open/close transitions
- The dropdown stays open while the user hovers over it, allowing interaction with its content
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<HoverCardStoryArgs>;

export const Default: Story = {
  args: {
    position: "top",
    withBeak: true,
    offset: 5,
    openDelay: 0,
    closeDelay: 150,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: HoverCardStoryArgs) => {
    return (
      <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">Hover me</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This is a hover card with informational content that appears when
            you hover over the target element.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  },
};

export const WithoutBeak: Story = {
  args: {
    position: "top",
    withBeak: false,
    offset: 5,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: HoverCardStoryArgs) => {
    return (
      <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="outline">Without Beak</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This hover card has the beak disabled, showing a clean dropdown
            without the pointing indicator.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  },
};

export const RichContent: Story = {
  args: {
    position: "top",
    offset: 5,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: HoverCardStoryArgs) => {
    return (
      <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">User Profile</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Group>
            <Avatar src={null} alt="User avatar" />
            <Stack>
              <Text>Jane Doe</Text>
              <Text>Software Engineer at Recursica</Text>
            </Stack>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  },
};
