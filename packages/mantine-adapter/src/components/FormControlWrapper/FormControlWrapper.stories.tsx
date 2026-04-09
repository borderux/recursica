import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormControlWrapper,
  type FormControlWrapperProps,
} from "./FormControlWrapper";
import { Layer } from "@recursica/adapter-common";
import { TextField } from "../TextField/TextField";

type WrapperStoryProps = FormControlWrapperProps & {
  layer?: number;
};

const meta: Meta<WrapperStoryProps> = {
  title: "UI-Kit/FormControlWrapper",
  component: FormControlWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The `FormControlWrapper` is the ultimate structural replacement for Mantine's built-in `Input.Wrapper`. By abandoning Mantine's opinionated wrappers entirely, we centralize all label tracking, error rendering, ARIA generation, and grid layouts natively inside this single component.\n\n### Usage with Naked Primitives\nThis component wraps 'naked' elements like `<Input>` directly. The demonstration stories below utilize `<TextField>` as a native display vehicle, since `<TextField>` natively pipes all its properties structurally back into this wrapper.",
      },
    },
  },
  argTypes: {
    formLayout: {
      control: "radio",
      options: ["stacked", "side-by-side"],
      description:
        "Controls the architectural grid mapping labels linearly or side-by-side.",
    },
    error: {
      control: "text",
      description:
        "Error string driving native assistive component and validation markers.",
    },
    assistiveText: {
      control: "text",
      description:
        "Helper instructions safely dynamically anchored below the input box.",
    },
    assistiveWithIcon: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    layer: {
      control: "radio",
      options: [0, 1, 2, 3],
      description: "The design system layer context",
      table: {
        category: "Story Controls",
      },
    },
  },
};

export default meta;

type Story = StoryObj<WrapperStoryProps>;

// Utility mapping to pipe raw wrapper args structurally into TextField accurately
const renderWithTextField = ({
  layer = 0,
  label,
  ...args
}: WrapperStoryProps) => (
  <Layer layer={layer as 0 | 1 | 2 | 3} style={{ padding: "24px" }}>
    <TextField
      label={label}
      placeholder="Form Control primitive mapped..."
      {...args}
    />
  </Layer>
);

export const Default: Story = {
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively.",
    layer: 0,
  },
  render: renderWithTextField,
};

export const VisualErrorState: Story = {
  args: {
    label: "Encryption Protocol",
    formLayout: "stacked",
    error: "Strict validation limits reached. Handshake rejected securely.",
  },
  render: renderWithTextField,
};

export const RequiredArchitecture: Story = {
  args: {
    label: "Root Password",
    formLayout: "side-by-side",
    required: true,
    assistiveText: "Bypass string structure required to initiate protocol.",
  },
  render: renderWithTextField,
};

export const WithoutAssistiveIcons: Story = {
  args: {
    label: "Server Domain",
    assistiveText:
      "A standard text boundary without default native icon parameters bounding.",
    assistiveWithIcon: false,
  },
  render: renderWithTextField,
};

export const NativeChildrenDirectly: Story = {
  description:
    "Bypassing the TextField map to show exactly how native `<input>` hooks execute inside the raw wrapper natively perfectly.",
  args: {
    label: "Raw HTML Checkbox",
    formLayout: "side-by-side",
    assistiveText: "This wraps a raw HTML input tag mapping correctly.",
  },
  render: ({ layer = 0, ...args }) => (
    <Layer
      layer={layer as 0 | 1 | 2 | 3}
      style={{
        padding: "24px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      {/* We can cleanly wrap even un-styled HTML primitives! */}
      <FormControlWrapper {...args}>
        <input
          type="checkbox"
          style={{ margin: 0, width: "16px", height: "16px" }}
        />
      </FormControlWrapper>
    </Layer>
  ),
};
