# FileUpload - Usage Guide

This document describes how to integrate and use the `FileUpload` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { FileUpload } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

`FileUpload` is a **controlled** component: it never stores the selected files itself. `onFilesAdded` reports newly dropped/picked files, `onFileRemove` reports which file was removed, and you own the `files` array in between.

```tsx
import React, { useState } from "react";
import { FileUpload } from "@recursica/mantine-adapter";
import { type RecursicaFileUploadItem } from "@recursica/adapter-common";

export default function Demo() {
  const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);

  return (
    <FileUpload
      label="Upload Files"
      assistiveText="Max file size 5MB"
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
}
```

---

## 3. Props Reference

| Prop                | Type                        | Description                                                                                                           |
| ------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `files`             | `RecursicaFileUploadItem[]` | Files currently selected, rendered as removable chips below the dropzone. Each item is `{ file: File; id?: string }`. |
| `onFilesAdded`      | `(files: File[]) => void`   | Called with newly dropped/picked files. Only the new files — merge them into `files` yourself.                        |
| `onFileRemove`      | `(id: string) => void`      | Called with a file's `id` (or `file.name` if no `id` was given) when its remove (X) icon is activated.                |
| `accept`            | `string`                    | Native `accept` attribute for the file picker (e.g. `".pdf,.png"` or `"image/*"`).                                    |
| `multiple`          | `boolean`                   | Whether more than one file can be selected/dropped at once. Defaults to `true`.                                       |
| `maxSize`           | `number`                    | Maximum size per file, in bytes. Oversized files go to `onFilesRejected` instead of `onFilesAdded`.                   |
| `onFilesRejected`   | `(files: File[]) => void`   | Called with files rejected for exceeding `maxSize`.                                                                   |
| `dropzoneLabel`     | `React.ReactNode`           | Text shown inside the dropzone. Defaults to `"Drag and drop files here to upload"`.                                   |
| `browseButtonLabel` | `React.ReactNode`           | Label for the button that opens the native file picker. Defaults to `"Browse files"`.                                 |
| `removeFileLabel`   | `string`                    | Screen-reader label for each file chip's remove button. Defaults to `"Remove"`.                                       |
| `disabled`          | `boolean`                   | Disables the dropzone, browse button, and every file chip's remove icon.                                              |

`FileUpload` also accepts the standard Recursica form-control props (`label`, `assistiveText`, `error`, `required`, `withAsterisk`, `formLayout`, `labelSize`, `labelAlignment`, `labelOptionalText`, `labelWithEditIcon`, `onLabelEditClick`) — see [FormControlWrapper's USAGE.md](../FormControlWrapper/USAGE.md) for how these behave.

---

## 4. Rejecting Oversized Files

```tsx
<FileUpload
  label="Upload Files"
  assistiveText="Max file size 5MB"
  maxSize={5 * 1024 * 1024}
  files={files}
  onFilesAdded={(added) =>
    setFiles((prev) => [...prev, ...added.map((file) => ({ file }))])
  }
  onFilesRejected={(rejected) =>
    setError(`${rejected.length} file(s) exceeded the 5MB limit.`)
  }
  onFileRemove={(id) =>
    setFiles((prev) =>
      prev.filter((item) => (item.id ?? item.file.name) !== id),
    )
  }
/>
```

---

## 5. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.
