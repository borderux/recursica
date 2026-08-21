import { forwardRef } from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Breadcrumb.module.css";

import { type RecursicaBreadcrumbProps } from "@recursica/adapter-common";

export type BreadcrumbProps = RecursicaOverStyled<
  Omit<MuiBreadcrumbsProps, "variant" | "size"> & RecursicaBreadcrumbProps
>;

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  function Breadcrumb({ overStyled = false, separator = ">", ...rest }, ref) {
    const sanitizedProps = filterStylingProps(
      { separator, ...rest },
      overStyled,
    );

    // Note MUI's actual prop is "classes", not "classNames" (that's Mantine's naming) — this
    // used to read the wrong key, silently no-op-ing any caller-supplied classes.
    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        ol: styles.ol,
        separator: styles.separator,
      },
      (sanitizedProps as Record<string, unknown>).classes as
        | Partial<Record<string, string>>
        | undefined,
    );

    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    return (
      <MuiBreadcrumbs
        ref={ref}
        {...(sanitizedProps as unknown as MuiBreadcrumbsProps)}
        className={finalClass}
        classes={mergedClassNames}
      />
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
