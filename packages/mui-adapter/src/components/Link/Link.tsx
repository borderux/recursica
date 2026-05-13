import React, { forwardRef } from "react";
import { Link as MUILink, type LinkProps as MUILinkProps } from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Link.module.css";

export interface RecursicaLinkProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  component?: React.ElementType;
}

export type LinkProps = RecursicaOverStyled<
  Omit<MUILinkProps, "underline"> & RecursicaLinkProps
>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { icon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MUILink
      ref={ref}
      className={finalClass}
      underline="none"
      {...(icon ? { "data-has-icon": "" } : {})}
      {...sanitizedProps}
    >
      {icon && (
        <span className={styles.iconWrapper} aria-hidden>
          {icon}
        </span>
      )}
      <span className={styles.labelText}>{children}</span>
    </MUILink>
  );
});

Link.displayName = "Link";
