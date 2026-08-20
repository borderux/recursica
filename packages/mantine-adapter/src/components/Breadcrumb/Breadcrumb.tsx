import { forwardRef } from "react";
import {
  Breadcrumbs as MantineBreadcrumbs,
  type BreadcrumbsProps as MantineBreadcrumbsProps,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Breadcrumb.module.css";

// Currently there are no Recursica prop additions specific to Breadcrumbs (like size or variant)
// according to recursica_ui-kit.json
import { type RecursicaBreadcrumbProps } from "@recursica/adapter-common";

export type BreadcrumbProps = RecursicaOverStyled<
  Omit<MantineBreadcrumbsProps, "variant" | "size"> & RecursicaBreadcrumbProps
>;

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  function Breadcrumb({ overStyled = false, separator = ">", ...rest }, ref) {
    const sanitizedProps = filterStylingProps(
      { separator, ...rest },
      overStyled,
    );

    const mergedClassNames = mergeClassNames(
      {
        root: styles.root,
        separator: styles.separator,
      },
      (sanitizedProps as Record<string, unknown>).classNames as
        | Partial<Record<string, string>>
        | undefined,
    );

    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;
    const finalClass = classNameProp
      ? `${styles.root} ${classNameProp}`
      : styles.root;

    return (
      <MantineBreadcrumbs
        ref={ref}
        {...(sanitizedProps as unknown as MantineBreadcrumbsProps)}
        className={finalClass}
        classNames={mergedClassNames}
      />
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
