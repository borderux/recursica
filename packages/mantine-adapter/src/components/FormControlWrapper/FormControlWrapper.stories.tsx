import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormControlWrapper,
  type FormControlWrapperProps,
} from "./FormControlWrapper";
import { TextField } from "../TextField/TextField";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

type WrapperStoryProps = FormControlWrapperProps;

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
    ...formControlArgTypes,
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
  },
};

export default meta;

type Story = StoryObj<WrapperStoryProps>;

const renderWithTextField = (args: WrapperStoryProps) => (
  <TextField placeholder="Form Control primitive mapped..." {...args} />
);

export const Default: Story = {
  args: {
    label: "Account Username",
    formLayout: "stacked",
    assistiveText: "Validation occurs immediately natively.",
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
  render: (args) => (
    <div
      style={{
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
    </div>
  ),
};
