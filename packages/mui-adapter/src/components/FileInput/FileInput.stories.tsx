import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileInput } from "./FileInput";
import { type RecursicaFileUploadItem } from "@recursica/adapter-common";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

function mockFile(name: string, size = 1024) {
  return new File([new Uint8Array(size)], name);
}

const meta: Meta<typeof FileInput> = {
  title: "UI-Kit/FileInput",
  component: FileInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`FileInput\` component is a single-line, \`TextField\`-shaped control for choosing files, integrated directly into the \`FormControlWrapper\` architecture. It shares \`FileUpload\`'s selection/validation interface (\`accept\`/\`maxSize\`/\`maxFiles\`, \`readOnly\`) behind a different presentation — a single file renders as plain text, multiple files render as an inline chip row, and a trailing icon clears the current selection.

### Examples
\`\`\`tsx
<FileInput
  label="Resume"
  files={files}
  onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
  onFileRemove={() => setFiles([])}
/>
\`\`\`
`,
      },
    },
  },
  argTypes: {
    ...formControlArgTypes,
    accept: {
      control: "text",
      description:
        "Native `accept` attribute for the file picker (e.g. `.pdf,.png`).",
    },
    multiple: {
      control: "boolean",
      description:
        "Whether more than one file can be selected/dropped at once. Defaults to `false`.",
    },
    maxSize: {
      control: "number",
      description: "Maximum size per file, in bytes.",
    },
    maxFiles: {
      control: "number",
      description:
        "Maximum total number of files allowed. Only meaningful when `multiple` is `true`.",
    },
    readOnly: {
      control: "boolean",
      description:
        "Renders `files` as a static, non-interactive display with no clear/remove icons.",
    },
    placeholder: {
      control: "text",
    },
    icon: {
      table: { disable: true },
    },
    files: {
      table: { disable: true },
    },
    onFilesAdded: {
      table: { disable: true },
    },
    onFileRemove: {
      table: { disable: true },
    },
    onFilesRejected: {
      table: { disable: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileInput>;
type FileInputStoryArgs = React.ComponentProps<typeof FileInput> & {
  withLayer?: boolean;
  layer?: number;
};

export const Default: Story = {
  args: {
    label: "Resume",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
        onFileRemove={() => setFiles([])}
      />
    );
  },
};

export const WithFile: Story = {
  args: {
    label: "Resume",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("resume.pdf") },
    ]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
        onFileRemove={() => setFiles([])}
      />
    );
  },
};

export const MultipleFiles: Story = {
  args: {
    label: "Attachments",
    assistiveText: "Up to 5 files",
    multiple: true,
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("document.pdf") },
      { file: mockFile("image.png") },
      { file: mockFile("spreadsheet.xlsx") },
    ]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) =>
          setFiles((prev) => [...prev, ...added.map((file) => ({ file }))])
        }
        onFileRemove={(id) =>
          setFiles((prev) =>
            prev.filter((item) => (item.id ?? item.file.name) !== id),
          )
        }
      />
    );
  },
};

export const SideBySide: Story = {
  args: {
    label: "Resume",
    assistiveText: "PDF or Word document",
    formLayout: "side-by-side",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
        onFileRemove={() => setFiles([])}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Resume",
    disabled: true,
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("resume.pdf") },
    ]);
    return <FileInput {...args} files={files} />;
  },
};

export const ErrorState: Story = {
  args: {
    label: "Resume",
    error: "A file is required.",
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Attachments",
    assistiveText: "Submitted files cannot be changed",
    multiple: true,
    readOnly: true,
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("document.pdf") },
      { file: mockFile("image.png") },
    ]);
    return <FileInput {...args} files={files} />;
  },
};

// Demonstrates that `accept` isn't just cosmetic on the native file-picker dialog — files that
// don't match it are rejected the same way whether picked or dropped directly (drag-and-drop
// bypasses the native `accept` filtering entirely, so this only works because FileInput
// re-validates it itself, same as FileUpload). Drag a non-.pdf file onto the control to see it
// switch into its error state with the default `invalidFileTypeMessage`.
export const AcceptRestriction: Story = {
  args: {
    label: "Resume",
    assistiveText: "Only .pdf files are accepted",
    accept: ".pdf",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
        onFileRemove={() => setFiles([])}
      />
    );
  },
};

// Demonstrates `maxFiles` in multiple-file mode: already at the 2-file cap below, so
// dropping/picking another file is rejected with the default `maxFilesMessage`.
export const MaxFilesRestriction: Story = {
  args: {
    label: "Attachments",
    assistiveText: "Up to 2 files allowed",
    multiple: true,
    maxFiles: 2,
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("document.pdf") },
      { file: mockFile("image.png") },
    ]);
    return (
      <FileInput
        {...args}
        files={files}
        onFilesAdded={(added) =>
          setFiles((prev) => [...prev, ...added.map((file) => ({ file }))])
        }
        onFileRemove={(id) =>
          setFiles((prev) =>
            prev.filter((item) => (item.id ?? item.file.name) !== id),
          )
        }
      />
    );
  },
};
