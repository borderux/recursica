import React, { forwardRef } from "react";
import { Chip as MuiChip, type ChipProps as MuiChipProps } from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Chip.module.css";

import { type RecursicaChipProps } from "@recursica/adapter-common";

export type ChipProps = RecursicaOverStyled<
  Omit<MuiChipProps, "variant" | "size" | "color" | "radius" | "children"> &
    RecursicaChipProps & {
      // MUI's own ChipProps types `children` as `null | undefined` (MUI's Chip expects `label`
      // instead) — this component's actual API is `children` (see the `label={...}` JSX below,
      // which always wins over any caller-supplied `label` in `sanitizedProps`), so restore a
      // real type for it here.
      children?: React.ReactNode;
    }
>;

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function CheckIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const Chip = forwardRef<HTMLInputElement, ChipProps>(function Chip(
  {
    error = false,
    icon,
    onDelete,
    deleteLabel = "Delete",
    deleteTabIndex,
    deleteIconRef,
    children,
    checked,
    overStyled = false,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Note MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
  // used to read the wrong key, silently no-op-ing any caller-supplied classes.
  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      label: styles.label,
      icon: styles.leadingIcon,
      deleteIcon: styles.deleteIconWrapper,
    },
    restRecord.classes as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  // Determine state
  const dataError = error ? "" : undefined;
  const dataChecked = checked ? "" : undefined;
  const isIconOnly = !children && (!!icon || !!onDelete);
  // A chip only counts as interactive when something actually responds to it — merely passing a
  // `checked` value (e.g. to pin a display-only chip to a fixed visual state, as FileUpload's
  // read-only file list does) isn't itself an interaction, since clicking it with no onChange/
  // onClick wired does nothing observable.
  const isInteractive =
    onDelete !== undefined ||
    restRecord.onClick !== undefined ||
    restRecord.onChange !== undefined;

  return (
    <MuiChip
      ref={ref}
      className={finalClass}
      classes={mergedClassNames}
      {...(dataError !== undefined ? { "data-error": "" } : {})}
      {...(dataChecked !== undefined ? { "data-checked": "" } : {})}
      {...(isIconOnly ? { "data-icon-only": "" } : {})}
      {...(isInteractive ? { "data-interactive": "" } : {})}
      {...sanitizedProps}
      icon={
        checked ? (
          <span className={styles.checkIconWrapper} aria-hidden>
            <CheckIcon />
          </span>
        ) : icon ? (
          <span className={styles.leadingIcon} aria-hidden>
            {icon}
          </span>
        ) : undefined
      }
      onDelete={onDelete}
      deleteIcon={
        onDelete ? (
          <span
            ref={deleteIconRef}
            role="button"
            className={styles.deleteIconWrapper}
            aria-label={deleteLabel}
            tabIndex={deleteTabIndex ?? 0}
            onKeyDown={(e) => {
              // MUI's native `onDelete` wiring (distinct from our own `onDelete` prop above) only
              // reacts to Backspace/Delete, and only when this span itself is both the event's
              // target and currentTarget — neither holds once a parent (e.g. FileUpload's
              // roving-tabindex group) moves real focus onto this span directly. A plain `<span>`
              // also gets no native Enter/Space-triggers-click behavior the way a real `<button>`
              // would, so it's handled explicitly here instead.
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onDelete(
                  e as unknown as React.MouseEvent<HTMLSpanElement, MouseEvent>,
                );
              }
            }}
          >
            <CloseIcon />
          </span>
        ) : undefined
      }
      label={
        <span className={styles.innerWrapper}>
          <span className={styles.children}>{children}</span>
        </span>
      }
    />
  );
});

Chip.displayName = "Chip";
