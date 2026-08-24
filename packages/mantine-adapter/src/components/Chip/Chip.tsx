import React, { forwardRef } from "react";
import {
  Chip as MantineChip,
  type ChipProps as MantineChipProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  withCallerOverride,
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
    onDelete,
    deleteLabel = "Delete",
    deleteTabIndex,
    deleteIconRef,
    children,
    overStyled = false,
    wrapperProps,
    tabIndex,
    "aria-hidden": ariaHidden,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      label: styles.label,
      input: styles.input,
      iconWrapper: styles.mantineIconWrapper,
      checkIcon: styles.checkIcon,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  // Determine state
  const dataError = error ? "" : undefined;
  const isIconOnly = !children && (!!icon || !!onDelete);
  // A chip only counts as interactive when something actually responds to it — merely passing a
  // `checked` value (e.g. to pin a display-only chip to a fixed visual state, as FileUpload's
  // read-only file list does) isn't itself an interaction, since clicking it with no onChange/
  // onClick wired does nothing observable.
  const isInteractive =
    onDelete !== undefined ||
    restRecord.onClick !== undefined ||
    restRecord.onChange !== undefined;

  // Our own computed default for Mantine's `wrapperProps` — flags the internal error/interactive
  // CSS hooks. This is a real Mantine `ChipProps` slot a caller could legitimately pass their own
  // value for, so it must merge via `withCallerOverride`, not silently clobber theirs.
  const computedWrapperProps = {
    ...(dataError !== undefined ? { "data-error": "" } : {}),
    ...(isInteractive ? { "data-interactive": "" } : {}),
  } as NonNullable<MantineChipProps["wrapperProps"]>;

  return (
    <MantineChip
      ref={ref}
      {...sanitizedProps}
      className={finalClass}
      classNames={mergedClassNames}
      wrapperProps={withCallerOverride(computedWrapperProps, wrapperProps)}
      data-icon-only={isIconOnly ? "" : undefined}
      tabIndex={withCallerOverride<number | undefined>(
        isInteractive ? undefined : -1,
        tabIndex,
      )}
      aria-hidden={withCallerOverride<boolean | "true" | "false" | undefined>(
        isInteractive ? undefined : true,
        ariaHidden,
      )}
    >
      <span className={styles.innerWrapper}>
        {icon && (
          <span className={styles.leadingIcon} aria-hidden>
            {icon}
          </span>
        )}

        <span className={styles.children}>{children}</span>

        {onDelete && (
          <span
            ref={deleteIconRef}
            role="button"
            className={styles.deleteIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(e);
            }}
            aria-label={deleteLabel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onDelete(
                  e as unknown as React.MouseEvent<HTMLSpanElement, MouseEvent>,
                );
              }
            }}
            tabIndex={deleteTabIndex ?? 0}
          >
            <CloseIcon />
          </span>
        )}
      </span>
    </MantineChip>
  );
});

Chip.displayName = "Chip";
