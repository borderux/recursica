import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import { Button } from "../Button";

/**
 * Menu story axes:
 * - trigger: click (default) vs hover behavior
 * - position: dropdown alignment relative to target
 * - withArrow: arrow indicator on the dropdown
 * - content variations: icons, dividers, labels, disabled items, submenus
 * - layer: tested via the global Layer decorator (withLayer/layer args)
 */

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ArrowsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MenuStoryArgs = Record<string, any>;

const meta: Meta = {
  title: "UI-Kit/Menu",
  component: Menu,
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      control: "select",
      options: ["click", "hover", "click-hover"],
      description:
        "Determines how the menu is triggered: click (default), hover, or both.",
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
      description: "The position of the dropdown relative to the target.",
    },
    withArrow: {
      control: "boolean",
      description: "Whether to display an arrow pointing to the target.",
    },
    offset: {
      control: "number",
      description:
        "Distance in px between the dropdown and the target element.",
    },
    opened: {
      control: "boolean",
      description:
        "Controlled open state. Leave undefined for uncontrolled behavior.",
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
The \`Menu\` component combines a list of secondary actions into a single interactive overlay area, wrapping Mantine's composable \`Menu\` while enforcing strict Recursica design token styling.

### Composable API

Menu uses a dot-notation composition pattern:
- \`<Menu>\` — Root container managing open/close state
- \`<Menu.Target>\` — Wrapper for the trigger element (must be a single element supporting ref)
- \`<Menu.Dropdown>\` — The popup panel
- \`<Menu.Item>\` — An actionable item with optional \`leftSection\` / \`rightSection\`
- \`<Menu.Divider>\` — A visual separator
- \`<Menu.Label>\` — A non-interactive section header

### Sub-menus
Nested menus are supported via \`<Menu.Sub>\`, \`<Menu.Sub.Target>\`, \`<Menu.Sub.Item>\`, and \`<Menu.Sub.Dropdown>\`.

### Design Token Limitations
Mantine's \`color\` prop on \`Menu.Item\` is stripped in strict mode to enforce design token adherence. Use \`overStyled={true}\` to bypass this restriction.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<MenuStoryArgs>;

export const Default: Story = {
  args: {
    trigger: "click",
    position: "bottom-start",
    withArrow: false,
    offset: 5,
    opened: undefined,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: MenuStoryArgs) => {
    return (
      <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Toggle Menu</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<ImageIcon />}>Gallery</Menu.Item>
          <Menu.Item leftSection={<SearchIcon />}>Search</Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item leftSection={<ArrowsIcon />}>Transfer my data</Menu.Item>
          <Menu.Item leftSection={<TrashIcon />}>Delete my account</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  },
};

export const WithDisabledItems: Story = {
  args: {
    position: "bottom-start",
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: MenuStoryArgs) => {
    return (
      <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Menu with Disabled</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<SearchIcon />} disabled>
            Search (disabled)
          </Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<TrashIcon />} disabled>
            Delete (disabled)
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  },
};

export const WithSubmenus: Story = {
  args: {
    position: "bottom-start",
    width: 200,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: MenuStoryArgs) => {
    return (
      <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Menu with Submenus</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>Dashboard</Menu.Item>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Products</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item>All products</Menu.Item>
              <Menu.Item>Categories</Menu.Item>
              <Menu.Item>Tags</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Orders</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item>Open</Menu.Item>
              <Menu.Item>Completed</Menu.Item>
              <Menu.Item>Cancelled</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        </Menu.Dropdown>
      </Menu>
    );
  },
};

export const HoverTrigger: Story = {
  args: {
    trigger: "click-hover",
    position: "bottom-start",
    openDelay: 100,
    closeDelay: 400,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ withLayer, layer, ...args }: MenuStoryArgs) => {
    return (
      <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Hover or Click</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<ImageIcon />}>Gallery</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  },
};
