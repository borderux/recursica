import React, { forwardRef } from "react";
import {
  Anchor as MantineAnchor,
  type AnchorProps as MantineAnchorProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Link.module.css";

export interface RecursicaLinkProps {
  /**
   * Optional leading icon to display next to the link text.
   */
  icon?: React.ReactNode;
  /**
   * The text or elements to display inside the link.
   */
  children?: React.ReactNode;
}

export type LinkProps = RecursicaOverStyled<
  Omit<MantineAnchorProps, "underline"> & RecursicaLinkProps
>;

const _Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { icon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineAnchor
      ref={ref}
      className={finalClass}
      classNames={mergedClassNames}
      underline="never"
      {...(icon ? { "data-has-icon": "" } : {})}
      {...sanitizedProps}
    >
      {icon && (
        <span className={styles.iconWrapper} aria-hidden>
          {icon}
        </span>
      )}
      <span className={styles.labelText}>{children}</span>
    </MantineAnchor>
  );
});
_Link.displayName = "Link";

/**
 * Recursica Link component wrapping Mantine's Anchor.
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering (e.g. react-router Link).
 * @example
 * ```tsx
 * <Link component="a" href="https://example.com">External Link</Link>
 * <Link renderRoot={(props) => <RouterLink to="/home" {...props} />}>Home</Link>
 * ```
 */
export const Link = createPolymorphicComponent<"a", LinkProps>(_Link);
