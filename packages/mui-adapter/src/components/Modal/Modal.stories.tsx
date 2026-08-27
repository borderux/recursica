import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal, type ModalProps } from "./Modal";
import { Button } from "../Button";

const meta: Meta<typeof Modal> = {
  title: "UI-Kit/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    opened: { table: { disable: true } },
    onClose: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const DefaultWrapper = (args: ModalProps) => {
  // Starts opened so the modal is visible without pressing a button first.
  const [opened, setOpened] = useState(true);
  return (
    <>
      <Modal {...args} opened={opened} onClose={() => setOpened(false)}>
        Please log in to continue accessing this feature.
        <Modal.Footer>
          <Button variant="outline" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpened(false)}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>
    </>
  );
};

export const Default: Story = {
  args: {
    title: "Authentication Required",
  },
  render: (args) => <DefaultWrapper {...args} />,
};

const LongTitleWrapper = (args: ModalProps) => {
  const [opened, setOpened] = useState(true);
  return (
    <>
      <Modal {...args} opened={opened} onClose={() => setOpened(false)}>
        The title above is longer than the header can display, so it truncates
        with an ellipsis instead of wrapping onto a second line.
        <Modal.Footer>
          <Button onClick={() => setOpened(false)}>Got it</Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>
    </>
  );
};

export const LongTitle: Story = {
  args: {
    title:
      "This Modal Title Is Deliberately Long Enough To Exceed The Available Header Width",
  },
  render: (args) => <LongTitleWrapper {...args} />,
};

const ScrollingWrapper = (args: ModalProps) => {
  // Starts opened so the modal is visible without pressing a button first.
  const [opened, setOpened] = useState(true);
  return (
    <>
      <Modal {...args} opened={opened} onClose={() => setOpened(false)}>
        <p>
          This modal demonstrates the dynamically injected scroll dividers. When
          this body content overflows, the borders between the Header and Footer
          automatically appear to define the scrolling boundary.
        </p>
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <p key={i}>Scrolling content block {i + 1}...</p>
          ))}
        {/* The new Footer abstraction */}
        <Modal.Footer>
          <Button variant="outline" onClick={() => setOpened(false)}>
            Decline
          </Button>
          <Button onClick={() => setOpened(false)}>Accept Terms</Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => setOpened(true)}>Open Scrolling Modal</Button>
    </>
  );
};

export const ScrollingContent: Story = {
  args: {
    title: "Terms and Conditions",
  },
  render: (args) => <ScrollingWrapper {...args} />,
};
