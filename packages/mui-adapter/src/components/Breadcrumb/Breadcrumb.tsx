import { forwardRef } from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from "@mui/material";
import {
  filterStylingProps,
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

    const mergedClassNames: Partial<Record<string, string>> = {
      root: styles.root,
      separator: styles.separator,
    };

    const classNamesProp = (sanitizedProps as Record<string, unknown>)
      .classNames;
    if (
      classNamesProp &&
      typeof classNamesProp === "object" &&
      !Array.isArray(classNamesProp)
    ) {
      const o = classNamesProp as Partial<Record<string, string>>;
      mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
      mergedClassNames.separator = o.separator
        ? `${styles.separator} ${o.separator}`
        : styles.separator;
    }

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
