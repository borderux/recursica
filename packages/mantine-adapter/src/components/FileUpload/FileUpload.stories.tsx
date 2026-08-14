import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { type RecursicaFileUploadItem } from "@recursica/adapter-common";
import { formControlArgTypes } from "../../../.storybook/commonArgTypes";

function mockFile(name: string, size = 1024) {
  return new File([new Uint8Array(size)], name);
}

const meta: Meta<typeof FileUpload> = {
  title: "UI-Kit/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`FileUpload\` component is a drag-and-drop dropzone with a native browse-button fallback, integrated directly into the \`FormControlWrapper\` architecture. Selected files render as a removable-chip list below the dropzone.

### Examples
\`\`\`tsx
<FileUpload
  label="Upload Files"
  assistiveText="Max file size 5MB"
  files={files}
  onFilesAdded={(added) =>
    setFiles((prev) => [...prev, ...added.map((file) => ({ file }))])
  }
  onFileRemove={(id) =>
    setFiles((prev) => prev.filter((item) => (item.id ?? item.file.name) !== id))
  }
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
      description: "Whether multiple files can be selected/dropped at once.",
    },
    maxSize: {
      control: "number",
      description: "Maximum size per file, in bytes.",
    },
    dropzoneLabel: {
      control: "text",
    },
    browseButtonLabel: {
      control: "text",
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

type Story = StoryObj<typeof FileUpload>;
type FileUploadStoryArgs = React.ComponentProps<typeof FileUpload> & {
  withLayer?: boolean;
  layer?: number;
};

export const Default: Story = {
  args: {
    label: "Upload Files",
    assistiveText: "Max file size 5MB",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return (
      <FileUpload
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

export const WithFiles: Story = {
  args: {
    label: "Upload Files",
    assistiveText: "Max file size 5MB",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("document.pdf") },
      { file: mockFile("image.png") },
      { file: mockFile("spreadsheet.xlsx") },
    ]);
    return (
      <FileUpload
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

export const EmptyState: Story = {
  args: {
    label: "Upload Files",
  },
};

export const Disabled: Story = {
  args: {
    label: "Upload Files",
    disabled: true,
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([
      { file: mockFile("document.pdf") },
    ]);
    return <FileUpload {...args} files={files} />;
  },
};

export const ErrorState: Story = {
  args: {
    label: "Upload Files",
    error: "File upload failed. Please try again.",
  },
};
