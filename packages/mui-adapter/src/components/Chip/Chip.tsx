import React, { forwardRef } from "react";
import { Chip as MuiChip, type ChipProps as MuiChipProps } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Chip.module.css";

import { type RecursicaChipProps } from "@recursica/adapter-common";

export type ChipProps = RecursicaOverStyled<
  Omit<MuiChipProps, "variant" | "size" | "color" | "radius"> &
    RecursicaChipProps
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
    onRemove,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeLabel = "Remove",
    children,
    checked,
    overStyled = false,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    label: styles.label,
    icon: styles.leadingIcon,
    deleteIcon: styles.removeIconWrapper,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.label = o.label
      ? `${styles.label} ${o.label}`
      : styles.label;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  // Determine state
  const dataError = error ? "" : undefined;
  const dataChecked = checked ? "" : undefined;
  const isIconOnly = !children && (!!icon || !!onRemove);

  return (
    <MuiChip
      ref={ref}
      className={finalClass}
      classes={mergedClassNames}
      {...(dataError !== undefined ? { "data-error": "" } : {})}
      {...(dataChecked !== undefined ? { "data-checked": "" } : {})}
      {...(isIconOnly ? { "data-icon-only": "" } : {})}
      {...sanitizedProps}
      icon={
        checked ? (
          <span className={styles.mantineIconWrapper} aria-hidden>
            <CheckIcon />
          </span>
        ) : icon ? (
          <span className={styles.leadingIcon} aria-hidden>
            {icon}
          </span>
        ) : undefined
      }
      onDelete={onRemove}
      deleteIcon={
        onRemove ? (
          <span className={styles.removeIconWrapper}>
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
