import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, type TooltipProps } from "./Tooltip";
import { Button } from "../Button";

/**
 * Tooltip story axes:
 * - position: tooltip alignment relative to target
 * - withBeak: beak (arrow) indicator on the tooltip
 * - openDelay / closeDelay: hover timing controls
 * - multiline: text wrapping behavior
 * - disabled: suppress the tooltip entirely
 * - layer: tested via the global Layer decorator (withLayer/layer args)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TooltipStoryArgs = Record<string, any>;

const meta: Meta = {
  title: "UI-Kit/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Content displayed inside the tooltip.",
    },
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
      description: "The position of the tooltip relative to the target.",
    },
    withBeak: {
      control: "boolean",
      description:
        "Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow.",
    },
    offset: {
      control: "number",
      description: "Distance in px between the tooltip and the target element.",
    },
    openDelay: {
      control: "number",
      description: "Delay in ms before the tooltip opens on hover.",
    },
    closeDelay: {
      control: "number",
      description: "Delay in ms before the tooltip closes when hover ends.",
    },
    disabled: {
      control: "boolean",
      description: "If set, the tooltip will not be rendered.",
    },
    opened: {
      control: "boolean",
      description:
        "Force the tooltip to stay open. Useful for inspecting styling.",
    },
    // Hide auto-detected HTML attributes that leak from ElementProps<'div'>
    defaultChecked: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    suppressContentEditableWarning: { table: { disable: true } },
    suppressHydrationWarning: { table: { disable: true } },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`Tooltip\` component displays a floating label when the user hovers over or focuses a target element. It wraps Mantine's \`Tooltip\` while enforcing strict Recursica design token styling.

### API

Unlike \`HoverCard\`, Tooltip is a single component — content is passed via the \`label\` prop:
\`\`\`tsx
<Tooltip label="Helpful text" withBeak>
  <Button>Hover me</Button>
</Tooltip>
\`\`\`

### Static Sub-Components
- \`Tooltip.Floating\` — A tooltip that follows the cursor position
- \`Tooltip.Group\` — Groups multiple tooltips to share hover delay

### Key Behaviors
- The beak (arrow) is shown by default (\`withBeak={true}\`)
- Supports \`openDelay\` and \`closeDelay\` for timing control
- Set \`multiline\` to allow text wrapping within max-width
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<TooltipStoryArgs>;

export const Default: Story = {
  args: {
    label: "This is a helpful tooltip",
    position: "top",
    withBeak: true,
    offset: 5,
    openDelay: 0,
    closeDelay: 0,
    disabled: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: TooltipStoryArgs) => {
    return (
      <Tooltip {...(args as TooltipProps)}>
        <Button variant="solid">Hover me</Button>
      </Tooltip>
    );
  },
};

export const WithoutBeak: Story = {
  args: {
    label: "Tooltip without a beak indicator",
    position: "top",
    withBeak: false,
    offset: 5,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: TooltipStoryArgs) => {
    return (
      <Tooltip {...(args as TooltipProps)}>
        <Button variant="outline">Without Beak</Button>
      </Tooltip>
    );
  },
};

export const LongContent: Story = {
  args: {
    label:
      "This is a longer tooltip message that demonstrates how text wraps within the maximum width defined by the design system.",
    position: "top",
    withBeak: true,
    opened: true,
    offset: 5,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: TooltipStoryArgs) => {
    return (
      <Tooltip {...(args as TooltipProps)}>
        <Button variant="solid">Long Content</Button>
      </Tooltip>
    );
  },
};
