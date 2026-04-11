import React, { forwardRef } from "react";
import {
  Chip as MantineChip,
  type ChipProps as MantineChipProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Chip.module.css";

export interface RecursicaChipProps {
  /** Enables the error state styling */
  error?: boolean;

  /** Leading icon content */
  icon?: React.ReactNode;

  /** Called when the remove (X) icon is clicked. If provided, the remove icon will be displayed. */
  onRemove?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;

  /** Screen reader label for the remove button. Defaults to 'Remove' */
  removeLabel?: string;
}

export type ChipProps = RecursicaOverStyled<
  Omit<MantineChipProps, "variant" | "size" | "color" | "radius"> &
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

export const Chip = forwardRef<HTMLInputElement, ChipProps>(function Chip(
  {
    error = false,
    icon,
    onRemove,
    removeLabel = "Remove",
    children,
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
    input: styles.input,
    iconWrapper: styles.mantineIconWrapper,
    checkIcon: styles.checkIcon,
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
  const isIconOnly = !children && (!!icon || !!onRemove);

  return (
    <MantineChip
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      {...(dataError !== undefined ? { "data-error": "" } : {})}
      {...(isIconOnly ? { "data-icon-only": "" } : {})}
      {...sanitizedProps}
    >
      <span className={styles.innerWrapper}>
        {icon && (
          <span className={styles.leadingIcon} aria-hidden>
            {icon}
          </span>
        )}

        <span className={styles.children}>{children}</span>

        {onRemove && (
          <span
            role="button"
            className={styles.removeIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(e);
            }}
            aria-label={removeLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onRemove(
                  e as unknown as React.MouseEvent<HTMLSpanElement, MouseEvent>,
                );
              }
            }}
            tabIndex={0}
          >
            <CloseIcon />
          </span>
        )}
      </span>
    </MantineChip>
  );
});

Chip.displayName = "Chip";
