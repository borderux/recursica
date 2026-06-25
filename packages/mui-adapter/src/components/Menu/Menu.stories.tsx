/**
 * Menu story axes:
 * - trigger: click (default) vs hover behavior
 * - position: dropdown alignment relative to target
 * - withArrow: arrow indicator on the dropdown
 * - content variations: icons, dividers, labels, disabled items, submenus
 * - layer: tested via the global Layer decorator (withLayer/layer args)
 */

import React, { useState, useRef, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Menu, MenuItem, MenuDivider } from "./Menu";
import { Button } from "../Button";
import { ListSubheader } from "@mui/material";

const SettingsIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SearchIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ImageIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ArrowsIcon = (props: React.ComponentProps<"svg">) => (
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
    {...props}
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

type MenuStoryArgs = Record<string, unknown>;

const meta: Meta = {
  title: "UI-Kit/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<MenuStoryArgs>;

interface InteractiveMenuProps {
  children?: React.ReactNode;
  opened?: boolean;
  [key: string]: unknown;
}

const InteractiveMenu = ({ children, ...args }: InteractiveMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = Boolean(anchorEl) || args.opened;

  useEffect(() => {
    if (args.opened && buttonRef.current) {
      setAnchorEl(buttonRef.current);
    }
  }, [args.opened]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button ref={buttonRef} variant="solid" onClick={handleClick}>
        Toggle Menu
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} {...args}>
        {children}
      </Menu>
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <InteractiveMenu {...args}>
      <ListSubheader>Application</ListSubheader>
      <MenuItem>
        <SettingsIcon style={{ marginRight: 8 }} /> Settings
      </MenuItem>
      <MenuItem>
        <MessageIcon style={{ marginRight: 8 }} /> Messages
      </MenuItem>
      <MenuItem>
        <ImageIcon style={{ marginRight: 8 }} /> Gallery
      </MenuItem>
      <MenuItem>
        <SearchIcon style={{ marginRight: 8 }} /> Search
      </MenuItem>
      <MenuDivider />
      <ListSubheader>Danger zone</ListSubheader>
      <MenuItem>
        <ArrowsIcon style={{ marginRight: 8 }} /> Transfer my data
      </MenuItem>
      <MenuItem>
        <TrashIcon style={{ marginRight: 8 }} /> Delete my account
      </MenuItem>
    </InteractiveMenu>
  ),
  args: {
    opened: true,
  },
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <InteractiveMenu {...args}>
      <MenuItem>
        <SettingsIcon style={{ marginRight: 8 }} /> Settings
      </MenuItem>
      <MenuItem disabled>
        <SearchIcon style={{ marginRight: 8 }} /> Search (disabled)
      </MenuItem>
      <MenuItem>
        <MessageIcon style={{ marginRight: 8 }} /> Messages
      </MenuItem>
      <MenuItem disabled>
        <TrashIcon style={{ marginRight: 8 }} /> Delete (disabled)
      </MenuItem>
    </InteractiveMenu>
  ),
  args: {
    opened: true,
  },
};

export const HoverTrigger: Story = {
  render: (args) => (
    <InteractiveMenu {...args}>
      <MenuItem>
        <SettingsIcon style={{ marginRight: 8 }} /> Settings
      </MenuItem>
      <MenuItem>
        <MessageIcon style={{ marginRight: 8 }} /> Messages
      </MenuItem>
      <MenuItem>
        <ImageIcon style={{ marginRight: 8 }} /> Gallery
      </MenuItem>
    </InteractiveMenu>
  ),
  args: {
    opened: true,
  },
};
