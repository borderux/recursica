import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";
import { Flex } from "../Flex/Flex";

const meta: Meta<typeof Chip> = {
  title: "Chip/Group",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Chip>;

// Single selection example
export const SingleSelection: Story = {
  render: () => (
    <Chip.Group>
      <Flex gap={8}>
        <Chip value="1" label="Single chip" />
        <Chip value="2" label="Can be selected" />
        <Chip value="3" label="At a time" />{" "}
        <Chip
          value="4"
          label="At a time"
          icon={{
            unselected: "favorite_Outlined",
            selected: "favorite_Filled",
          }}
        />
      </Flex>
    </Chip.Group>
  ),
};

// Multiple selection example
export const MultipleSelection: Story = {
  render: () => (
    <Chip.Group multiple>
      <Flex gap={8}>
        <Chip value="1" label="Multiple chips" />
        <Chip value="2" label="Can be selected" />
        <Chip value="3" label="At a time" />
        <Chip
          value="4"
          label="At a time"
          icon={{
            unselected: "favorite_Outlined",
            selected: "favorite_Filled",
          }}
        />
      </Flex>
    </Chip.Group>
  ),
};

// With default value
export const WithDefaultValue: Story = {
  render: () => (
    <Chip.Group defaultValue="2">
      <Flex gap={8}>
        <Chip value="1" label="First" />
        <Chip value="2" label="Second" />
        <Chip value="3" label="Third" />{" "}
        <Chip
          value="4"
          label="At a time"
          icon={{
            unselected: "favorite_Outlined",
            selected: "favorite_Filled",
          }}
        />
      </Flex>
    </Chip.Group>
  ),
};
