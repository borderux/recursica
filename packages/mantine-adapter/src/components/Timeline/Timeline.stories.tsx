import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./Timeline";

const meta: Meta<typeof Timeline> = {
  title: "UI-Kit/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    defaultChecked: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    active: 1,
  },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Commit created"
        timestamp="Yesterday"
        bulletVariant="default"
      >
        You pushed 3 new commits to the repository.
      </Timeline.Item>
      <Timeline.Item
        title="Pull request opened"
        timestamp="2 days ago"
        bulletVariant="default"
      >
        You opened a pull request for the feature branch.
      </Timeline.Item>
      <Timeline.Item
        title="Code review completed"
        timestamp="1 week ago"
        bulletVariant="default"
      >
        Your pull request was approved by 2 reviewers.
      </Timeline.Item>
      <Timeline.Item
        title="Branch merged"
        timestamp="2 weeks ago"
        bulletVariant="default"
      >
        Your feature branch was successfully merged into main.
      </Timeline.Item>
    </Timeline>
  ),
};

export const BulletVariants: Story = {
  args: {
    active: 1,
  },
  render: (args) => (
    <Timeline {...args}>
      <Timeline.Item
        title="Default Bullet"
        timestamp="Standard configuration"
        bulletVariant="default"
      >
        The default un-configured structural dot.
      </Timeline.Item>
      <Timeline.Item
        title="Icon Bullet"
        timestamp="Standard sized icons"
        bulletVariant="icon"
        bullet={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        }
      >
        A standard structural icon node mapping.
      </Timeline.Item>
      <Timeline.Item
        title="Alternative Icon"
        timestamp="Larger structural bounds"
        bulletVariant="icon-alternative"
        bullet={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        }
      >
        A slightly larger alternative bounding box for specialized icons.
      </Timeline.Item>
      <Timeline.Item
        title="Avatar Bullet"
        timestamp="Profile pictures"
        bulletVariant="avatar"
        bullet={
          <img
            src="https://avatars.githubusercontent.com/u/10353856?s=460&v=4"
            alt="avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "inherit",
            }}
          />
        }
      >
        Avatar mappings inherently drop borders and leverage specific opacity
        states.
      </Timeline.Item>
    </Timeline>
  ),
};
