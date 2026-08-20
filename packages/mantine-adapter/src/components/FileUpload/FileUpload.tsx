import React, { forwardRef, useEffect, useRef, useState } from "react";
import { type InputWrapperProps } from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import { Button } from "../Button/Button";
import { Chip } from "../Chip/Chip";
import {
  FormControlWrapper,
  type RecursicaFormControlWrapperProps,
} from "../FormControlWrapper/FormControlWrapper";
import styles from "./FileUpload.module.css";

import {
  fileMatchesAccept,
  type RecursicaFileUploadItem,
  type RecursicaFileUploadProps as BaseRecursicaFileUploadProps,
} from "@recursica/adapter-common";
export type { RecursicaFileUploadItem };

export interface RecursicaFileUploadProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "children" | "onDrop" | "onChange"
    >,
    Pick<
      InputWrapperProps,
      "label" | "error" | "required" | "withAsterisk" | "id"
    >,
    Omit<
      RecursicaFormControlWrapperProps,
      "controlMaxWidth" | "controlMinWidth"
    >,
    BaseRecursicaFileUploadProps {}

export type FileUploadProps = RecursicaOverStyled<RecursicaFileUploadProps>;

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M4 21h16" />
    </svg>
  );
}

/**
 * A dropzone for uploading files, with a native browse-button fallback and a
 * removable-chip list of the currently selected files.
 *
 * @example
 * <FileUpload
 *   label="Upload Files"
 *   assistiveText="Max file size 5MB"
 *   files={files}
 *   onFilesAdded={(added) => setFiles((f) => [...f, ...added.map((file) => ({ file }))])}
 *   onFileRemove={(id) => setFiles((f) => f.filter((item) => (item.id ?? item.file.name) !== id))}
 * />
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload(props, ref) {
    const {
      overStyled = false,
      formLayout = "stacked",

      // Label & Wrapper Maps
      labelSize,
      labelAlignment,
      labelOptionalText,
      labelWithEditIcon,
      labelActionArea,
      onLabelEditClick,

      label,
      assistiveText,
      assistiveWithIcon,
      error,
      required,
      withAsterisk,
      id,
      className,
      style,
      disabled,
      readOnly,

      files,
      onFilesAdded,
      onFileRemove,
      accept,
      multiple = true,
      maxSize,
      maxFiles,
      onFilesRejected,
      invalidFileTypeMessage = "File type not accepted",
      maxFilesMessage = `Maximum of ${maxFiles} files allowed`,
      icon,
      dropzoneLabel = "Drag and drop files here to upload",
      browseButtonLabel = "Browse files",
      removeFileLabel = "Remove",
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    const inputRef = useRef<HTMLInputElement>(null);

    // Whether the most recent drop/pick attempt included a file that failed the `accept` check —
    // surfaced as the control's error state (see `effectiveError` below) rather than left for the
    // integrator to wire up themselves.
    const [invalidTypeRejected, setInvalidTypeRejected] = useState(false);
    // Whether the most recent drop/pick attempt included a file that would have pushed the total
    // past `maxFiles` — surfaced the same way as `invalidTypeRejected` (see `effectiveError`).
    const [tooManyFilesRejected, setTooManyFilesRejected] = useState(false);

    const handleFiles = (incoming: FileList | File[]) => {
      if (disabled) return;
      const list = Array.from(incoming);
      if (list.length === 0) return;

      const currentCount = files?.length ?? 0;
      const accepted: File[] = [];
      const rejected: File[] = [];
      let hasInvalidType = false;
      let hasTooMany = false;
      for (const file of list) {
        const isInvalidType = !fileMatchesAccept(file, accept);
        if (isInvalidType) hasInvalidType = true;
        const isTooLarge = maxSize !== undefined && file.size > maxSize;
        const wouldExceedMax =
          maxFiles !== undefined && currentCount + accepted.length >= maxFiles;
        if (wouldExceedMax) hasTooMany = true;
        const isRejected = isInvalidType || isTooLarge || wouldExceedMax;
        (isRejected ? rejected : accepted).push(file);
      }
      setInvalidTypeRejected(hasInvalidType);
      setTooManyFilesRejected(hasTooMany);
      if (accepted.length > 0) onFilesAdded?.(accepted);
      if (rejected.length > 0) onFilesRejected?.(rejected);
    };

    // Counts nested dragenter/dragleave pairs (they fire for every child element the pointer
    // crosses, not just the dropzone itself) so the drag-over visual state only clears once the
    // pointer has actually left the dropzone, not just moved between its children.
    const dragCounterRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounterRef.current += 1;
      setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragging(false);
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      // Required so the browser treats this element as a valid drop target.
      event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    };

    const openFilePicker = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) handleFiles(event.target.files);
      // Reset so picking the same file again still fires a change event.
      event.target.value = "";
    };

    // Roving tabindex across the file chip list: only the "active" chip's remove icon is a tab
    // stop (Tab lands on the first chip), and Left/Right/Up/Down move it — see
    // FILEUPLOAD_IMPLEMENTATION_NOTES.md.
    const [activeChipIndex, setActiveChipIndex] = useState(0);
    const removeIconRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const prevFileCountRef = useRef(files?.length ?? 0);

    useEffect(() => {
      const count = files?.length ?? 0;
      // A chip was removed (via keyboard or otherwise) — keep focus in the list, clamped to the
      // new length, rather than letting it fall back to the document body.
      if (count > 0 && count < prevFileCountRef.current) {
        const nextIndex = Math.min(activeChipIndex, count - 1);
        setActiveChipIndex(nextIndex);
        removeIconRefs.current[nextIndex]?.focus();
      }
      prevFileCountRef.current = count;
      // Only react to the file list itself shrinking/growing, not to activeChipIndex changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const handleFileListKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
    ) => {
      const count = files?.length ?? 0;
      if (count === 0) return;
      let nextIndex: number | undefined;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (activeChipIndex + 1) % count;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (activeChipIndex - 1 + count) % count;
      }
      if (nextIndex === undefined) return;
      event.preventDefault();
      setActiveChipIndex(nextIndex);
      removeIconRefs.current[nextIndex]?.focus();
    };

    // The built-in `accept`-mismatch message is only shown when the integrator hasn't supplied
    // their own `error` — an explicit error always wins.
    const effectiveError =
      error ??
      (invalidTypeRejected
        ? invalidFileTypeMessage
        : tooManyFilesRejected
          ? maxFilesMessage
          : undefined);

    const wrapperClass = className
      ? `${styles.layoutOverride} ${className}`
      : styles.layoutOverride;

    return (
      <FormControlWrapper
        overStyled={overStyled as true}
        className={wrapperClass}
        style={style}
        formLayout={formLayout}
        labelSize={labelSize}
        labelAlignment={labelAlignment}
        labelOptionalText={labelOptionalText}
        labelWithEditIcon={labelWithEditIcon}
        labelActionArea={labelActionArea}
        onLabelEditClick={onLabelEditClick}
        label={label}
        assistiveText={assistiveText}
        assistiveWithIcon={assistiveWithIcon}
        error={effectiveError}
        required={required}
        withAsterisk={withAsterisk}
        id={id}
      >
        <div
          ref={ref}
          {...restRecord}
          className={styles.root}
          data-disabled={disabled ? "true" : undefined}
          data-error={effectiveError ? "true" : undefined}
        >
          {!readOnly && (
            <div
              className={styles.dropzone}
              data-dragging={isDragging ? "true" : undefined}
              onDragEnter={disabled ? undefined : handleDragEnter}
              onDragLeave={disabled ? undefined : handleDragLeave}
              onDragOver={disabled ? undefined : handleDragOver}
              onDrop={disabled ? undefined : handleDrop}
            >
              <span className={styles.uploadIcon}>
                {icon ?? <UploadIcon />}
              </span>
              <span className={styles.dropzoneText}>{dropzoneLabel}</span>
              <Button
                variant="outline"
                disabled={disabled}
                onClick={openFilePicker}
              >
                {browseButtonLabel}
              </Button>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleInputChange}
              />
            </div>
          )}

          {files &&
            files.length > 0 &&
            (readOnly ? (
              <div className={styles.fileList}>
                {files.map((item: RecursicaFileUploadItem) => {
                  const itemId = item.id ?? item.file.name;
                  return (
                    <Chip key={itemId} checked={false} tabIndex={-1}>
                      {item.file.name}
                    </Chip>
                  );
                })}
              </div>
            ) : (
              <div
                className={styles.fileList}
                onKeyDown={handleFileListKeyDown}
              >
                {files.map((item: RecursicaFileUploadItem, index) => {
                  const itemId = item.id ?? item.file.name;
                  return (
                    <Chip
                      key={itemId}
                      checked={false}
                      tabIndex={-1}
                      removeLabel={removeFileLabel}
                      removeTabIndex={index === activeChipIndex ? 0 : -1}
                      removeIconRef={(el) => {
                        removeIconRefs.current[index] = el;
                      }}
                      onRemove={
                        disabled ? undefined : () => onFileRemove?.(itemId)
                      }
                    >
                      {item.file.name}
                    </Chip>
                  );
                })}
              </div>
            ))}
        </div>
      </FormControlWrapper>
    );
  },
);

FileUpload.displayName = "FileUpload";
