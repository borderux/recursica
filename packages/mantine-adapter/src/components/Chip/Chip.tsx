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
import { type RecursicaChipProps } from "@recursica/adapter-common";

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
    removeTabIndex,
    removeIconRef,
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
  // A chip only counts as interactive when something actually responds to it — merely passing a
  // `checked` value (e.g. to pin a display-only chip to a fixed visual state, as FileUpload's
  // read-only file list does) isn't itself an interaction, since clicking it with no onChange/
  // onClick wired does nothing observable.
  const isInteractive =
    onRemove !== undefined ||
    restRecord.onClick !== undefined ||
    restRecord.onChange !== undefined;

  return (
    <MantineChip
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      wrapperProps={{
        ...(dataError !== undefined ? { "data-error": "" } : {}),
        ...(isInteractive ? { "data-interactive": "" } : {}),
      }}
      {...(isIconOnly ? { "data-icon-only": "" } : {})}
      {...(!isInteractive ? { tabIndex: -1, "aria-hidden": true } : {})}
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
            ref={removeIconRef}
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
            tabIndex={removeTabIndex ?? 0}
          >
            <CloseIcon />
          </span>
        )}
      </span>
    </MantineChip>
  );
});

Chip.displayName = "Chip";
