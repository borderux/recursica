import React from "react";

/**
 * A single file entry rendered as a removable chip in the FileUpload's file list.
 */
export interface RecursicaFileUploadItem {
  /** The underlying browser File object. */
  file: File;
  /**
   * Stable identifier for this entry, used as the React key and passed back to
   * `onFileRemove`. Defaults to the file's `name` when not provided.
   */
  id?: string;
}

/**
 * Props for the Recursica FileUpload component.
 */
export interface RecursicaFileUploadProps {
  /**
   * Files currently selected, rendered as removable chips below the dropzone.
   * This is a controlled list — `onFilesAdded`/`onFileRemove` report changes, but
   * `FileUpload` never mutates this array itself; merge the reported changes into
   * your own state and pass the updated list back in.
   */
  files?: RecursicaFileUploadItem[];
  /**
   * Called with the files the user just dropped onto the dropzone or picked via
   * the browse button. Only the newly added files are passed — merge them into
   * `files` yourself (e.g. to assign an `id`, dedupe, or reject some of them).
   */
  onFilesAdded?: (files: File[]) => void;
  /**
   * Called when a file chip's remove (X) icon is activated, identified by its
   * `id` (or `file.name` when no `id` was given for that entry).
   */
  onFileRemove?: (id: string) => void;
  /**
   * Native `accept` attribute for the underlying file input (e.g. `".pdf,.png"`
   * or `"image/*"`). Only constrains the browse-button file picker and the
   * dropzone's own drag-and-drop filtering; it is not re-validated beyond that.
   */
  accept?: string;
  /** Whether more than one file can be selected/dropped at once. Defaults to `true`. */
  multiple?: boolean;
  /**
   * Maximum size per file, in bytes. Files exceeding this are passed to
   * `onFilesRejected` instead of `onFilesAdded`.
   */
  maxSize?: number;
  /** Called with any files rejected for exceeding `maxSize`. */
  onFilesRejected?: (files: File[]) => void;
  /** Text shown inside the dropzone. Defaults to `"Drag and drop files here to upload"`. */
  dropzoneLabel?: React.ReactNode;
  /** Label for the button that opens the native file picker. Defaults to `"Browse files"`. */
  browseButtonLabel?: React.ReactNode;
  /** Screen-reader label for each file chip's remove button. Defaults to `"Remove"`. */
  removeFileLabel?: string;
  /** Disables the dropzone, browse button, and every file chip's remove icon. */
  disabled?: boolean;
}
