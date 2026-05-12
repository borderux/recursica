import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Panel, type PanelProps } from "./Panel";
import { Button } from "../Button";
import { Text } from "../Text/Text";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PanelStoryArgs = Record<string, any>;

const meta: Meta = {
  title: "UI-Kit/Panel",
  component: Panel,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "Side of the screen the panel slides in from.",
    },
    title: {
      control: "text",
      description: "Panel title displayed in the header.",
    },
    withOverlay: {
      control: "boolean",
      description: "Whether to display a background overlay.",
    },
    withCloseButton: {
      control: "boolean",
      description: "Whether to display the close button in the header.",
    },
    wrapHeaderText: {
      control: "boolean",
      description:
        "If true, forces the header text to a single line and truncates with an ellipsis.",
    },
    // Hide auto-detected HTML attributes
    defaultChecked: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    suppressContentEditableWarning: { table: { disable: true } },
    suppressHydrationWarning: { table: { disable: true } },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mantine's \`Drawer\`, it enforces Recursica design tokens for styling.

### Anatomy
1. **Header** — Title and close icon, remains fixed on scroll
2. **Divider** — Separates header/footer from content
3. **Body (Slot)** — Scrollable content area for custom content
4. **Footer** — Fixed action buttons (Recursica-specific)

### Usage
\`\`\`tsx
const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Panel</Button>
<Panel opened={opened} onClose={close} title="Settings" position="right">
  Content goes here
  <Panel.Footer>
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save</Button>
  </Panel.Footer>
</Panel>
\`\`\`
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<PanelStoryArgs>;

export const Default: Story = {
  args: {
    position: "right",
    title: "Panel Title",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false,
  },
  render: ({ wrapHeaderText, ...args }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);

    return (
      <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Panel
        </Button>
        <Panel
          {...(args as PanelProps)}
          opened={opened}
          onClose={() => setOpened(false)}
          title="Panel Title"
          position="right"
          wrapHeaderText={wrapHeaderText}
        >
          <Text>
            This is the panel body content area. Panels slide in from the edge
            of the screen to reveal supplementary information, navigation
            options, or toolsets.
          </Text>
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </Panel.Footer>
        </Panel>
      </>
    );
  },
};

export const LeftPosition: Story = {
  args: {
    position: "left",
    title: "Navigation",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpened(true)}>
          Open Left Panel
        </Button>
        <Panel
          {...(args as PanelProps)}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <Text>
            A panel sliding in from the left, commonly used for navigation menus
            or sidebars.
          </Text>
        </Panel>
      </>
    );
  },
};

export const ScrollableContent: Story = {
  args: {
    position: "right",
    title: "Scrollable Panel",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);

    return (
      <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Scrollable Panel
        </Button>
        <Panel
          {...(args as PanelProps)}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} style={{ marginBottom: "1rem" }}>
              Paragraph {i + 1}: This is sample content to demonstrate the
              scrollable behavior of the panel when content exceeds the viewport
              height.
            </p>
          ))}
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button variant="solid">Apply</Button>
          </Panel.Footer>
        </Panel>
      </>
    );
  },
};

export const LongTitle: Story = {
  args: {
    position: "right",
    title:
      "This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: true,
  },
  render: ({ ...args }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);

    return (
      <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Long Title Panel
        </Button>
        <Panel
          {...(args as PanelProps)}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <Text>
            Check the header to see if the long title is handled gracefully
            without pushing the close button off screen.
          </Text>
        </Panel>
      </>
    );
  },
};
