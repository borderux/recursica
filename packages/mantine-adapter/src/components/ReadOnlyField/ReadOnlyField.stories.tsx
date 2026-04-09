/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { ReadOnlyField } from "./ReadOnlyField";
import { Layer, EmptyValueRenderer } from "@recursica/adapter-common";

const meta: Meta<typeof ReadOnlyField> = {
  title: "UI Kit/ReadOnlyField",
  component: ReadOnlyField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs.",
      },
    },
  },
  args: {
    label: "Read Only Label",
    value: "Fixed Data Set Value",
    assistiveText: "Helper description text beneath the node.",
    type: "text",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "number"], // Add more as we support them
    },
    labelWithEditIcon: {
      control: "boolean",
    },
    // We cannot natively control a React.ElementType through standard primitive storybook panels.
  },
  decorators: [
    (Story, context) => {
      const { layer = 0 } = context.args as any;
      return (
        <Layer layer={layer}>
          <Story />
        </Layer>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ReadOnlyField>;

/**
 * Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.
 */
export const Default: Story = {
  args: {
    // layer defined temporarily inline above via mock decorator if proper `<Layer>` wrapper isn't natively bound here
  },
  argTypes: {
    layer: {
      control: { type: "number", min: 0, max: 3 },
      table: { category: "Storybook Wrappers" },
    } as any,
  },
};

/**
 * Shows the default handler replacing missing mapping data directly with 'N/A'.
 */
export const EmptyValue: Story = {
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')",
  },
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
};

/**
 * Validates the core read-only label execution and base default spacing bindings globally.
 */
export const StackedDefault: Story = {
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text",
  },
};

/**
 * Binds side-by-side structures globally maintaining correct inline gutter layouts.
 */
export const SideBySide: Story = {
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally",
  },
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
};
