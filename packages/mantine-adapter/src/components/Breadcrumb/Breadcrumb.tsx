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

    // Mantine's Breadcrumbs, unlike MUI's, doesn't hide the separator from screen
    // readers by default — it's a plain text node. Match MUI's built-in aria-hidden,
    // letting a caller override it via attributes.separator["aria-hidden"] if needed.
    const callerAttributes = (sanitizedProps as Record<string, unknown>)
      .attributes as
      | Partial<Record<string, Record<string, unknown>>>
      | undefined;
    const mergedAttributes = {
      ...callerAttributes,
      separator: {
        "aria-hidden": true,
        ...callerAttributes?.separator,
      },
    };

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
        attributes={mergedAttributes}
      />
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
