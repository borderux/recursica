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
import styles from "./FileInput.module.css";

import {
  fileMatchesAccept,
  type RecursicaFileUploadItem,
  type RecursicaFileInputProps as BaseRecursicaFileInputProps,
} from "@recursica/adapter-common";
export type { RecursicaFileUploadItem };

export interface RecursicaFileInputProps
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
    BaseRecursicaFileInputProps {}

export type FileInputProps = RecursicaOverStyled<RecursicaFileInputProps>;

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

function ClearIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * A single-line, `TextField`-shaped control for choosing one or more files, sharing
 * `FileUpload`'s selection/validation interface (`accept`/`maxSize`/`maxFiles`, `readOnly`)
 * behind a different presentation.
 *
 * @example
 * <FileInput
 *   label="Resume"
 *   files={files}
 *   onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}
 *   onFileRemove={() => setFiles([])}
 * />
 */
export const FileInput = forwardRef<HTMLDivElement, FileInputProps>(
  function FileInput(props, ref) {
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
      multiple = false,
      maxSize,
      maxFiles,
      onFilesRejected,
      invalidFileTypeMessage = "File type not accepted",
      maxFilesMessage = multiple
        ? `Maximum of ${maxFiles} files allowed`
        : "Only one file is allowed",
      icon,
      placeholder = "Select a file...",
      browseLabel = "Choose file",
      removeFileLabel = "Remove",
      clearLabel = "Clear",
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const restRecord = sanitizedProps as Record<string, unknown>;

    const interactive = !disabled && !readOnly;
    const hasFiles = !!files && files.length > 0;

    const inputRef = useRef<HTMLInputElement>(null);

    // Whether the most recent drop/pick attempt included a file that failed the `accept` check —
    // surfaced as the control's error state (see `effectiveError` below), same as FileUpload.
    const [invalidTypeRejected, setInvalidTypeRejected] = useState(false);
    // Whether the most recent drop/pick attempt included a file past the effective cap — 1 in
    // single-file mode, `maxFiles` in multiple-file mode.
    const [tooManyFilesRejected, setTooManyFilesRejected] = useState(false);

    const handleFiles = (incoming: FileList | File[]) => {
      if (!interactive) return;
      const list = Array.from(incoming);
      if (list.length === 0) return;

      // Single-file mode always replaces the current selection rather than adding to it, so it
      // never counts the existing file against the cap — the effective cap is just 1.
      const effectiveMaxFiles = multiple ? maxFiles : 1;
      const currentCount = multiple ? (files?.length ?? 0) : 0;

      const accepted: File[] = [];
      const rejected: File[] = [];
      let hasInvalidType = false;
      let hasTooMany = false;
      for (const file of list) {
        const isInvalidType = !fileMatchesAccept(file, accept);
        if (isInvalidType) hasInvalidType = true;
        const isTooLarge = maxSize !== undefined && file.size > maxSize;
        const wouldExceedMax =
          effectiveMaxFiles !== undefined &&
          currentCount + accepted.length >= effectiveMaxFiles;
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
    // crosses, not just the root itself) so the drag-over visual state only clears once the
    // pointer has actually left the control, not just moved between its children. Mirrors
    // FileUpload's dropzone.
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
      if (!interactive) return;
      inputRef.current?.click();
    };

    const handleRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openFilePicker();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) handleFiles(event.target.files);
      // Reset so picking the same file again still fires a change event.
      event.target.value = "";
    };

    const handleClearAll = () => {
      if (!interactive || !files || files.length === 0) return;
      files.forEach((item) => onFileRemove?.(item.id ?? item.file.name));
    };

    // Roving tabindex across the file chip list (single- or multiple-file mode): only the
    // "active" chip's remove icon is a tab stop, and Left/Right/Up/Down move it — same pattern
    // as FileUpload, see FILEINPUT_IMPLEMENTATION_NOTES.md.
    const [activeChipIndex, setActiveChipIndex] = useState(0);
    const removeIconRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const prevFileCountRef = useRef(files?.length ?? 0);

    useEffect(() => {
      const count = files?.length ?? 0;
      if (count > 0 && count < prevFileCountRef.current) {
        const nextIndex = Math.min(activeChipIndex, count - 1);
        setActiveChipIndex(nextIndex);
        removeIconRefs.current[nextIndex]?.focus();
      }
      prevFileCountRef.current = count;
      // Only react to the file list itself shrinking/growing, not to activeChipIndex changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const handleChipRowKeyDown = (
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
      event.stopPropagation();
      setActiveChipIndex(nextIndex);
      removeIconRefs.current[nextIndex]?.focus();
    };

    // The built-in `accept`/cap-mismatch message is only shown when the integrator hasn't
    // supplied their own `error` — an explicit error always wins.
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
        controlMaxWidth="var(--file-input-control-max-width)"
        controlMinWidth="var(--file-input-control-min-width)"
      >
        <div
          ref={ref}
          {...restRecord}
          className={styles.root}
          role="button"
          aria-label={browseLabel}
          aria-disabled={disabled ? "true" : undefined}
          tabIndex={interactive ? 0 : -1}
          data-disabled={disabled ? "true" : undefined}
          data-readonly={readOnly ? "true" : undefined}
          data-error={effectiveError ? "true" : undefined}
          data-dragging={isDragging ? "true" : undefined}
          onClick={interactive ? openFilePicker : undefined}
          onKeyDown={interactive ? handleRootKeyDown : undefined}
          onDragEnter={interactive ? handleDragEnter : undefined}
          onDragLeave={interactive ? handleDragLeave : undefined}
          onDragOver={interactive ? handleDragOver : undefined}
          onDrop={interactive ? handleDrop : undefined}
        >
          <span className={styles.leadingIcon} aria-hidden>
            {icon ?? <UploadIcon />}
          </span>

          <div className={styles.content}>
            {!hasFiles && (
              <span className={styles.value} data-placeholder="true">
                {placeholder}
              </span>
            )}

            {hasFiles && (
              <div
                className={styles.chipRow}
                onKeyDown={readOnly ? undefined : handleChipRowKeyDown}
              >
                {files!.map((item: RecursicaFileUploadItem, index) => {
                  const itemId = item.id ?? item.file.name;
                  return (
                    <span
                      key={itemId}
                      className={styles.chipWrapper}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Chip
                        checked={false}
                        tabIndex={-1}
                        removeLabel={readOnly ? undefined : removeFileLabel}
                        removeTabIndex={
                          !readOnly && index === activeChipIndex ? 0 : -1
                        }
                        removeIconRef={(el) => {
                          removeIconRefs.current[index] = el;
                        }}
                        onDelete={
                          readOnly || disabled
                            ? undefined
                            : () => onFileRemove?.(itemId)
                        }
                      >
                        {item.file.name}
                      </Chip>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {hasFiles && !readOnly && (
            <Button
              overStyled
              variant="text"
              size="small"
              icon={<ClearIcon />}
              aria-label={clearLabel}
              className={styles.trailingIcon}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClearAll();
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                e.stopPropagation();
                handleClearAll();
              }}
            />
          )}

          <input
            ref={inputRef}
            type="file"
            hidden
            accept={accept}
            multiple={multiple}
            disabled={!interactive}
            onChange={handleInputChange}
          />
        </div>
      </FormControlWrapper>
    );
  },
);

FileInput.displayName = "FileInput";
