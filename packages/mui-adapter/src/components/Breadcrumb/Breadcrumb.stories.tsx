import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { Link } from "../Link";

type BreadcrumbStoryProps = React.ComponentProps<typeof Breadcrumb> & {
  items?: string[];
};

const meta: Meta<BreadcrumbStoryProps> = {
  title: "UI-Kit/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Proper usage** (see `Default`): every crumb except the last is a `Link`; the last " +
          "crumb — the current page — is plain text (e.g. a `<span>`), not a link. `Breadcrumb` " +
          "does its best to neutralize a `Link` passed as the last item anyway (see " +
          "`LastItemAsLink`), but that's a safety net, not something to rely on — see " +
          "BREADCRUMB_IMPLEMENTATION_NOTES.md.",
      },
    },
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    items: {
      control: "object",
      description:
        "Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",
      table: {
        category: "Story Controls",
      },
    },
    separator: {
      control: "text",
      description: "Custom separator between items",
    },
  },
  args: {
    items: ["Home", "Components", "Breadcrumbs"],
  },
  render: ({ items, children, ...args }) => {
    const mappedChildren = items
      ? items.map((label, index) =>
          // The last crumb represents the current page, so it's plain text,
          // not a link — matches standard breadcrumb UX.
          index === items.length - 1 ? (
            <span key={index}>{label}</span>
          ) : (
            <Link href="#" key={index}>
              {label}
            </Link>
          ),
        )
      : children;

    return <Breadcrumb children={mappedChildren} {...args} />;
  },
};

export default meta;

type Story = StoryObj<BreadcrumbStoryProps>;

export const Default: Story = {
  args: {
    items: ["Dashboard", "Settings", "Security"],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→",
  },
};

export const LastItemAsLink: Story = {
  name: "Last Item As Link (Incorrect Usage)",
  args: {
    // Bypass the `items` convenience prop (which always renders the last crumb as a span) to
    // demonstrate what happens if a caller wraps every crumb, including the last, in a `Link`.
    items: undefined,
    children: [
      <Link href="#" key="dashboard">
        Dashboard
      </Link>,
      <Link href="#" key="settings">
        Settings
      </Link>,
      <Link href="#" key="security">
        Security
      </Link>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Incorrect usage, kept as a story to prove Breadcrumb still handles it: the last " +
          'crumb is a `Link`, but Breadcrumb adds `aria-current="page"`, strips its `href`/' +
          "`onClick`, drops it from the tab order, and the CSS reset removes Link's color/" +
          "underline — it renders identically to `Default`'s plain-text current item. Don't " +
          "rely on this; pass plain text for the last crumb instead.",
      },
    },
  },
};
