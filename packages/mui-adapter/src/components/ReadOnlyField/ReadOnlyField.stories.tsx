/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReadOnlyField, type ReadOnlyFieldProps } from "./ReadOnlyField";
import { EmptyValueRenderer } from "@recursica/adapter-common";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

const meta: Meta<typeof ReadOnlyField> = {
  title: "UI-Kit/ReadOnlyField",
  component: ReadOnlyField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs.",
      },
    },
    controls: {
      include: [
        "type",
        "labelWithEditIcon",
        "formLayout",
        "labelSize",
        "labelAlignment",
        "labelOptionalText",
        "required",
      ],
    },
  },
  args: {
    label: "Read Only Label",
    value: "Fixed Data Set Value",
    assistiveText: "Helper description text beneath the node.",
    type: "text",
  },
  argTypes: {
    ...formControlArgTypes,
    type: {
      control: "select",
      options: ["text", "number", "boolean", "switch", "date"], // Add more as we support them
    },
    labelWithEditIcon: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ReadOnlyField>;

/**
 * Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.
 */
export const Default: Story = {
  args: {},
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

/**
 * Shows the default handler replacing missing mapping data directly with 'N/A'.
 */
export const EmptyValue: Story = {
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')",
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

const CustomEmptyTextRenderer: React.FC<{ value?: any }> & {
  check?: (v: any) => boolean;
} = (props) => <EmptyValueRenderer {...props} emptyText="No Data Found" />;
CustomEmptyTextRenderer.check = EmptyValueRenderer.check;

/**
 * Demonstrates overriding the baseline verbiage internally utilizing the exported `EmptyValueRenderer` while inheriting default evaluation checks.
 */
export const CustomEmptyText: Story = {
  args: {
    value: null,
    label: "Custom Empty Text Default",
    emptyValueComponent: CustomEmptyTextRenderer,
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

const CustomEmptyCheckRenderer: React.FC<{ value?: any }> & {
  check?: (v: any) => boolean;
} = () => {
  return <i>Custom HTML Markup Provided</i>;
};
CustomEmptyCheckRenderer.check = (val) => val === "EMPTY_MOCK";

/**
 * Validates a fully overridden emptyValueComponent injecting custom rendering boundaries alongside explicitly tailored validation rules evaluating datasets dynamically.
 */
export const CustomEmptyRenderer: Story = {
  args: {
    value: "EMPTY_MOCK",
    label: "Custom Logic Evaluation Binding",
    emptyValueComponent: CustomEmptyCheckRenderer,
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

/**
 * Validates the core read-only label execution and base default spacing bindings globally.
 */
export const StackedDefault: Story = {
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text",
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

/**
 * Binds side-by-side structures globally maintaining correct inline gutter layouts.
 */
export const SideBySide: Story = {
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally",
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

/**
 * Tests the fallback structural logic when Edit icon natively overrides required bindings.
 */
export const WithEditIcon: Story = {
  args: {
    labelWithEditIcon: true,
    required: true,
    value: "Editable fixed structure",
  },
  render: ({ withLayer, layer, ...args }: any) => <ReadOnlyField {...args} />,
};

/**
 * Demonstrates how the generic ReadOnlyField handles mapping different internal data types.
 * Currently, all types safely default to string extraction mapping into the text renderer natively.
 */
export const DataTypes: Story = {
  args: {},
  render: ({ withLayer, layer, ...args }: any) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <ReadOnlyField
        {...args}
        label="Text Mapping"
        type="text"
        value="Standard string output"
      />
      <ReadOnlyField
        {...args}
        label="Number Mapping"
        type="number"
        value={1234567.89}
      />
      <ReadOnlyField
        {...args}
        label="Date Mapping"
        type="date"
        value={new Date("2026-04-28T12:00:00Z").toLocaleDateString()}
      />
      <ReadOnlyField
        {...args}
        label="Boolean Mapping (True)"
        type="boolean"
        value={true}
      />
      <ReadOnlyField
        {...args}
        label="Boolean Mapping (False)"
        type="boolean"
        value={false}
      />
      <ReadOnlyField
        {...args}
        label="Switch Mapping (True -> On)"
        type="switch"
        value={true}
      />
      <ReadOnlyField
        {...args}
        label="Switch Mapping (False -> Off)"
        type="switch"
        value={false}
      />
    </div>
  ),
};
