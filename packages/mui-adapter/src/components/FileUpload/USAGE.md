# FileUpload - Usage Guide

This document describes how to integrate and use the `FileUpload` component in your projects using `@recursica/mui-adapter`.

---

## 1. Import Reference

```tsx
import { FileUpload } from "@recursica/mui-adapter";
```

---

## 2. Basic Example

`FileUpload` is a **controlled** component: it never stores the selected files itself. `onFilesAdded` reports newly dropped/picked files, `onFileRemove` reports which file was removed, and you own the `files` array in between.

```tsx
import React, { useState } from "react";
import { FileUpload } from "@recursica/mui-adapter";
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

| Prop                     | Type                        | Description                                                                                                                                                                                                                          |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `files`                  | `RecursicaFileUploadItem[]` | Files currently selected, rendered as removable chips below the dropzone. Each item is `{ file: File; id?: string }`.                                                                                                                |
| `onFilesAdded`           | `(files: File[]) => void`   | Called with newly dropped/picked files. Only the new files — merge them into `files` yourself.                                                                                                                                       |
| `onFileRemove`           | `(id: string) => void`      | Called with a file's `id` (or `file.name` if no `id` was given) when its remove (X) icon is activated.                                                                                                                               |
| `accept`                 | `string`                    | Native `accept` attribute (e.g. `".pdf,.png"` or `"image/*"`) — constrains the picker dialog, and is also enforced against dropped files (via `onFilesRejected`), since the browser never applies `accept` to a `drop` event itself. |
| `multiple`               | `boolean`                   | Whether more than one file can be selected/dropped at once. Defaults to `true`.                                                                                                                                                      |
| `maxSize`                | `number`                    | Maximum size per file, in bytes. Oversized files go to `onFilesRejected` instead of `onFilesAdded`.                                                                                                                                  |
| `maxFiles`               | `number`                    | Maximum total number of files allowed in `files`. Files that would exceed it go to `onFilesRejected` instead of `onFilesAdded`.                                                                                                      |
| `onFilesRejected`        | `(files: File[]) => void`   | Called with files rejected for exceeding `maxSize`/`maxFiles` or not matching `accept`.                                                                                                                                              |
| `invalidFileTypeMessage` | `React.ReactNode`           | Error message shown when a file is rejected for not matching `accept`. Defaults to `"File type not accepted"`. An explicit `error` prop always takes priority over this.                                                             |
| `maxFilesMessage`        | `React.ReactNode`           | Error message shown when a file is rejected for exceeding `maxFiles`. Defaults to `"Maximum of {maxFiles} files allowed"`. An explicit `error` prop always takes priority over this.                                                 |
| `icon`                   | `React.ReactNode`           | Icon shown above the dropzone label. Defaults to the built-in upload icon.                                                                                                                                                           |
| `dropzoneLabel`          | `React.ReactNode`           | Text shown inside the dropzone. Defaults to `"Drag and drop files here to upload"`.                                                                                                                                                  |
| `browseButtonLabel`      | `React.ReactNode`           | Label for the button that opens the native file picker. Defaults to `"Browse files"`.                                                                                                                                                |
| `removeFileLabel`        | `string`                    | Screen-reader label for each file chip's remove button. Defaults to `"Remove"`.                                                                                                                                                      |
| `disabled`               | `boolean`                   | Disables the dropzone, browse button, and every file chip's remove icon.                                                                                                                                                             |
| `readOnly`               | `boolean`                   | Renders `files` as a static chip list with no remove icon, and omits the dropzone/browse button entirely.                                                                                                                            |

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

## 5. Rejecting Files by Extension/MIME Type

```tsx
<FileUpload
  label="Upload Files"
  assistiveText="Only .pdf and .png files are accepted"
  accept=".pdf,.png"
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
```

This applies equally to a file picked via "Browse files" and one dragged directly onto the
dropzone — the browser's own `accept` filtering never covers drag-and-drop, so `FileUpload`
re-validates it itself before calling `onFilesAdded`/`onFilesRejected`.

A mismatched file automatically puts the control into its error state with the message
`"File type not accepted"` — no need to wire `onFilesRejected` into your own `error` prop just to
show something. Override the message with `invalidFileTypeMessage`, or pass your own `error` prop
to take over the error state entirely:

```tsx
<FileUpload
  label="Upload Files"
  accept=".pdf,.png"
  invalidFileTypeMessage="Only PDF and PNG files are supported"
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
```

---

## 6. Limiting the Number of Files

```tsx
<FileUpload
  label="Upload Files"
  assistiveText="Up to 2 files allowed"
  maxFiles={2}
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
```

Once `files` reaches `maxFiles`, further dropped/picked files are rejected the same way an
`accept` mismatch is — automatically switching the control into its error state with the default
`maxFilesMessage` ("Maximum of 2 files allowed" for the example above). Override the message with
`maxFilesMessage`, or pass your own `error` prop to take over the error state entirely.

---

## 7. Read-only Mode

```tsx
<FileUpload label="Uploaded Files" readOnly files={files} />
```

Renders `files` as a plain, non-removable chip list with no dropzone or Browse button — for
displaying files that were already submitted and can no longer be changed. `onFilesAdded`/
`onFileRemove` aren't called in this mode since there's nothing to add or remove.

---

## 8. Keyboard Navigation of the File List

Once files are selected, their chips form a single roving-tabindex group, not one tab stop per
chip: `Tab` lands on the first chip's remove icon, `Enter`/`Space` removes the focused chip, and
`ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown` move focus between chips (wrapping at both ends).
This is a group-level pattern, not an option on `Chip` used standalone elsewhere. (Not applicable
in `readOnly` mode, which has no remove icons to navigate to.)

---

## 9. Design System Integration

All Recursica components in the `@recursica/mui-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.
