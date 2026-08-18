# FileInput - Usage Guide

This document describes how to integrate and use the `FileInput` component in your projects using `@recursica/mantine-adapter`.

---

## 1. Import Reference

```tsx
import { FileInput } from "@recursica/mantine-adapter";
```

---

## 2. Basic Example

`FileInput` is a **controlled** component: it never stores the selected file(s) itself. `onFilesAdded` reports newly picked/dropped files, `onFileRemove` reports which file was removed (or cleared), and you own the `files` array in between.

It shares `FileUpload`'s selection/validation interface, but is presented as a single-line, `TextField`-shaped control instead of a dropzone — every selected file renders as a removable chip in a horizontally scrollable row, whether `multiple` is set or not.

```tsx
import React, { useState } from "react";
import { FileInput } from "@recursica/mantine-adapter";
import { type RecursicaFileUploadItem } from "@recursica/adapter-common";

export default function Demo() {
  const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);

  return (
    <FileInput
      label="Resume"
      files={files}
      onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
      onFileRemove={() => setFiles([])}
    />
  );
}
```

Note that a single-file `onFilesAdded` handler typically **replaces** `files` wholesale (as above)
rather than appending — picking a new file in single-file mode always replaces the current one.

---

## 3. Props Reference

| Prop                     | Type                        | Description                                                                                                                                                                                                                          |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `files`                  | `RecursicaFileUploadItem[]` | Files currently selected. Each item is `{ file: File; id?: string }`.                                                                                                                                                                |
| `onFilesAdded`           | `(files: File[]) => void`   | Called with newly picked/dropped files. Only the new files — merge them into `files` yourself.                                                                                                                                       |
| `onFileRemove`           | `(id: string) => void`      | Called with a file's `id` (or `file.name` if no `id` was given) when it's removed via a chip's remove icon or the trailing clear button.                                                                                             |
| `accept`                 | `string`                    | Native `accept` attribute (e.g. `".pdf,.png"` or `"image/*"`) — constrains the picker dialog, and is also enforced against dropped files (via `onFilesRejected`), since the browser never applies `accept` to a `drop` event itself. |
| `multiple`               | `boolean`                   | Whether more than one file can be selected/dropped at once. Defaults to `false`, unlike `FileUpload` (defaults to `true`).                                                                                                           |
| `maxSize`                | `number`                    | Maximum size per file, in bytes. Oversized files go to `onFilesRejected` instead of `onFilesAdded`.                                                                                                                                  |
| `maxFiles`               | `number`                    | Maximum total number of files allowed. Only meaningful when `multiple` is `true` — single-file mode always caps at 1 regardless of this prop.                                                                                        |
| `onFilesRejected`        | `(files: File[]) => void`   | Called with files rejected for exceeding `maxSize`/`maxFiles` (or the single-file cap) or not matching `accept`.                                                                                                                     |
| `invalidFileTypeMessage` | `React.ReactNode`           | Error message shown when a file is rejected for not matching `accept`. Defaults to `"File type not accepted"`. An explicit `error` prop always takes priority over this.                                                             |
| `maxFilesMessage`        | `React.ReactNode`           | Error message shown when a file is rejected for exceeding the cap. Defaults to `"Maximum of {maxFiles} files allowed"` when `multiple`, or `"Only one file is allowed"` otherwise. An explicit `error` prop always wins.             |
| `icon`                   | `React.ReactNode`           | Leading icon shown inside the control. Defaults to the built-in upload icon.                                                                                                                                                         |
| `placeholder`            | `React.ReactNode`           | Text shown when no file is selected. Defaults to `"Select a file..."`.                                                                                                                                                               |
| `browseLabel`            | `string`                    | Screen-reader label for the control itself (it's the sole interactive/focusable surface, there being no separate "Browse" button). Defaults to `"Choose file"`.                                                                      |
| `removeFileLabel`        | `string`                    | Screen-reader label for a file chip's remove button. Defaults to `"Remove"`.                                                                                                                                                         |
| `clearLabel`             | `string`                    | Screen-reader label (`aria-label`) for the trailing clear-all `Button`. Defaults to `"Clear"`.                                                                                                                                       |
| `disabled`               | `boolean`                   | Disables the control and its clear/remove icons.                                                                                                                                                                                     |
| `readOnly`               | `boolean`                   | Renders `files` as a static, non-interactive display with no clear/remove icons, and disables picking or dropping new files.                                                                                                         |

`FileInput` also accepts the standard Recursica form-control props (`label`, `assistiveText`, `error`, `required`, `withAsterisk`, `formLayout`, `labelSize`, `labelAlignment`, `labelOptionalText`, `labelWithEditIcon`, `onLabelEditClick`) — see [FormControlWrapper's USAGE.md](../FormControlWrapper/USAGE.md) for how these behave.

---

## 4. Multiple Files

```tsx
<FileInput
  label="Attachments"
  assistiveText="Up to 5 files"
  multiple
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

With `multiple`, the same horizontally scrollable row of removable chips (the same `Chip`
component `FileUpload` uses) can hold more than one file, and the trailing `Button` clears the
entire selection at once rather than removing a single file.

---

## 5. Rejecting Oversized or Wrong-Type Files

Works exactly like `FileUpload`:

```tsx
<FileInput
  label="Resume"
  assistiveText="PDF only, max 5MB"
  accept=".pdf"
  maxSize={5 * 1024 * 1024}
  files={files}
  onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
  onFileRemove={() => setFiles([])}
/>
```

A mismatched or oversized file puts the control into its error state automatically — no need to
wire `onFilesRejected` into your own `error` prop just to show something. Override the message
with `invalidFileTypeMessage`/`maxFilesMessage`, or pass your own `error` prop to take over the
error state entirely.

---

## 6. Read-Only Display

```tsx
<FileInput
  label="Submitted Files"
  assistiveText="Submitted files cannot be changed"
  multiple
  readOnly
  files={files}
/>
```

Renders `files` as a static display with no clear/remove icons, and the control is no longer
focusable or clickable.

---

## 7. Design System Integration

All Recursica components in the `@recursica/mantine-adapter` package adhere strictly to design system spacing, scaling, and behavior patterns.

> [!IMPORTANT]
>
> - **Anti-override protection**: Rogue style injections (like inline `style` or arbitrary `className`) are automatically blocked by our prop layer unless `overStyled={true}` is explicitly provided.
> - **No Direct Layers**: Do not pass a `layer` prop to this component. To place it on a specific visual layer, wrap it in a `<Layer layer={0|1|2|3}>` component natively.
> - **Variables and Theming**: Styling is entirely determined by local CSS variables defined in `recursica_variables_scoped.css` and mapped in the component's CSS module.
