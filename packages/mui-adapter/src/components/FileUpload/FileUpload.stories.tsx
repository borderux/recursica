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
    maxFiles: {
      control: "number",
      description: "Maximum total number of files allowed.",
    },
    readOnly: {
      control: "boolean",
      description:
        "Renders `files` as a static chip list with no remove icon, and hides the dropzone.",
    },
    dropzoneLabel: {
      control: "text",
    },
    browseButtonLabel: {
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

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z" />
    </svg>
  );
}

export const CustomIcon: Story = {
  args: {
    label: "Upload Files",
    icon: <StarIcon />,
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

export const LongFilenames: Story = {
  args: {
    label: "Upload Files",
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([
      {
        file: mockFile("quarterly-financial-report-final-version-approved.pdf"),
      },
      { file: mockFile("2026-08-team-offsite-photos-and-notes.zip") },
      { file: mockFile("resume.docx") },
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

export const ReadOnly: Story = {
  args: {
    label: "Upload Files",
    assistiveText: "Submitted files cannot be changed",
    readOnly: true,
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
      { file: mockFile("image.png") },
    ]);
    return <FileUpload {...args} files={files} />;
  },
};

// Demonstrates that `accept` isn't just cosmetic on the browse-button dialog — files that don't
// match it are rejected the same way whether picked via Browse or dropped directly (drag-and-drop
// bypasses the native `accept` filtering entirely, so this only works because FileUpload
// re-validates it itself). Drag a non-.pdf/.png file onto the dropzone (or edit `accept` in the
// controls) to see the control switch into its error state with the default
// `invalidFileTypeMessage` ("File type not accepted") instead of accepting the file.
export const AcceptRestriction: Story = {
  args: {
    label: "Upload Files",
    assistiveText: "Only .pdf and .png files are accepted",
    accept: ".pdf,.png",
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

// Demonstrates `maxFiles`: already at the 2-file cap below, so dropping/picking another file is
// rejected the same way an `accept` mismatch is — the control switches into its error state with
// the default `maxFilesMessage` ("Maximum of 2 files allowed") instead of accepting the file.
export const MaxFilesRestriction: Story = {
  args: {
    label: "Upload Files",
    assistiveText: "Up to 2 files allowed",
    maxFiles: 2,
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
