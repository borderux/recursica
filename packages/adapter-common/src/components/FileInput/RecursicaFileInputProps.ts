import React from "react";
import { type RecursicaFileUploadItem } from "../FileUpload/RecursicaFileUploadProps";

export type { RecursicaFileUploadItem as RecursicaFileInputItem };

/**
 * Props for the Recursica FileInput component.
 *
 * `FileInput` is presented as a single-line, `TextField`-shaped control rather than
 * `FileUpload`'s dropzone, but shares the same file-selection interface and validation
 * behavior (`accept`/`maxSize`/`maxFiles`, `onFilesRejected`, `readOnly`) so integrators can
 * move between them without relearning the contract.
 */
export interface RecursicaFileInputProps {
  /**
   * Files currently selected. This is a controlled list — `onFilesAdded`/`onFileRemove`
   * report changes, but `FileInput` never mutates this array itself; merge the reported
   * changes into your own state and pass the updated list back in.
   */
  files?: RecursicaFileUploadItem[];
  /**
   * Called with the files the user just picked via the native file dialog or dropped onto
   * the control. Only the newly added files are passed — merge them into `files` yourself.
   */
  onFilesAdded?: (files: File[]) => void;
  /**
   * Called when a file's remove affordance is activated, identified by its `id` (or
   * `file.name` when no `id` was given for that entry). In single-file mode this is also
   * called when the trailing clear icon removes the one selected file.
   */
  onFileRemove?: (id: string) => void;
  /**
   * Native `accept` attribute for the underlying file input (e.g. `".pdf,.png"` or
   * `"image/*"`) — constrains the native file-picker dialog. Also enforced against files
   * dropped onto the control, the same way `FileUpload` enforces it.
   */
  accept?: string;
  /** Whether more than one file can be selected/dropped at once. Defaults to `false`. */
  multiple?: boolean;
  /**
   * Maximum size per file, in bytes. Files exceeding this are passed to
   * `onFilesRejected` instead of `onFilesAdded`.
   */
  maxSize?: number;
  /**
   * Maximum total number of files allowed in `files`. Only meaningful when `multiple` is
   * `true` — Once reached, further dropped/picked files are passed to `onFilesRejected`
   * instead of `onFilesAdded`.
   */
  maxFiles?: number;
  /**
   * Called with any files rejected for exceeding `maxSize`/`maxFiles` or not matching
   * `accept`.
   */
  onFilesRejected?: (files: File[]) => void;
  /**
   * Error message shown (via the standard assistive-text error slot) when a dropped/picked
   * file's extension or MIME type doesn't match `accept`. Defaults to
   * `"File type not accepted"`.
   */
  invalidFileTypeMessage?: React.ReactNode;
  /**
   * Error message shown (via the standard assistive-text error slot) when a dropped/picked
   * file would exceed `maxFiles`. Defaults to `"Maximum of {maxFiles} files allowed"`.
   */
  maxFilesMessage?: React.ReactNode;
  /** Leading icon shown inside the control. Defaults to the built-in upload icon. */
  icon?: React.ReactNode;
  /**
   * Trailing clear-all icon shown once a file is selected. Defaults to the built-in X icon.
   * Forge's `file-input` token set exposes a `trailing-icon` color alongside `leading-icon`
   * for exactly this slot.
   */
  clearIcon?: React.ReactNode;
  /** Text shown when no file is selected. Defaults to `"Select a file..."`. */
  placeholder?: React.ReactNode;
  /** Screen-reader label for the control itself. Defaults to `"Choose file"`. */
  browseLabel?: string;
  /** Screen-reader label for a file chip's remove button. Defaults to `"Remove"`. */
  removeFileLabel?: string;
  /** Screen-reader label for the trailing clear-all icon. Defaults to `"Clear"`. */
  clearLabel?: string;
  /** Disables the control and its remove/clear icons. */
  disabled?: boolean;
  /**
   * Renders `files` as a static, non-interactive display with no clear/remove icons, and
   * disables picking or dropping new files.
   */
  readOnly?: boolean;
}
