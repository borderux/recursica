import { forwardRef } from "react";
import {
  Anchor as MantineAnchor,
  type AnchorProps as MantineAnchorProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Link.module.css";

import { type RecursicaLinkProps } from "@recursica/adapter-common";

export type LinkProps = RecursicaOverStyled<
  Omit<MantineAnchorProps, "underline"> & Omit<RecursicaLinkProps, "component">
>;

const _Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { icon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  const mergedClassNames = mergeClassNames(
    { root: styles.root },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return (
    <MantineAnchor
      ref={ref}
      {...(sanitizedProps as Record<string, unknown>)}
      className={finalClass}
      classNames={mergedClassNames}
      underline="never"
      {...(icon ? { "data-has-icon": "" } : {})}
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
