import { forwardRef } from "react";
import {
  Drawer as MantineDrawer,
  type DrawerProps as MantineDrawerProps,
  type DrawerRootProps as MantineDrawerRootProps,
  type DrawerOverlayProps as MantineDrawerOverlayProps,
  type DrawerContentProps as MantineDrawerContentProps,
  type DrawerHeaderProps as MantineDrawerHeaderProps,
  type DrawerTitleProps as MantineDrawerTitleProps,
  type DrawerCloseButtonProps as MantineDrawerCloseButtonProps,
  type DrawerBodyProps as MantineDrawerBodyProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Panel.module.css";

// ============================================================
// PANEL (Drawer)
// ============================================================

import { type RecursicaPanelProps as BaseRecursicaPanelProps } from "@recursica/adapter-common";

/**
 * Recursica Panel root props. Extends Mantine Drawer.
 */
export interface RecursicaPanelProps
  extends Omit<
      MantineDrawerProps,
      "size" | "styles" | "classNames" | "style" | "position" | "opened"
    >,
    BaseRecursicaPanelProps {}

export type PanelProps = RecursicaOverStyled<RecursicaPanelProps>;

/**
 * Recursica Panel component wrapping Mantine's Drawer.
 *
 * Panels slide in or expand from the edge of the screen to reveal
 * additional content or functionality. They are commonly used to provide
 * supplementary information, navigation options, or toolsets without
 * cluttering the main interface.
 *
 * ```tsx
 * <Panel opened={opened} onClose={close} title="Panel Title" placement="right">
 *   <Panel.Body>
 *     Content goes here
 *   </Panel.Body>
 * </Panel>
 * ```
 *
 * Mantine Drawer sub-components available via dot-notation:
 * - `Panel.Header` — Top section with title and close button
 * - `Panel.Title` — Title text within the header
 * - `Panel.CloseButton` — Close button within the header
 * - `Panel.Body` — Scrollable body content area
 * - `Panel.Content` — Outer content container
 * - `Panel.Overlay` — Background overlay
 * - `Panel.Root` — Root element for advanced composition
 * - `Panel.Stack` — Stacked drawer context
 */
const PanelBase = function Panel({
  overStyled = false,
  placement = "right",
  keepMounted = true,
  wrapHeaderText = false,
  ...rest
}: PanelProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind CSS module classes to Mantine's internal classNames API
  const mergedClassNames: Partial<Record<string, string>> = {
    content: styles.content,
    header: styles.header,
    title: wrapHeaderText ? styles.titleTruncate : styles.title,
    body: styles.body,
    inner: styles.inner,
  };

  const classNamesProp = (sanitizedProps as Record<string, unknown>).classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Record<string, string>;
    Object.keys(o).forEach((key) => {
      if (mergedClassNames[key]) {
        mergedClassNames[key] = `${mergedClassNames[key]} ${o[key]}`;
      } else {
        mergedClassNames[key] = o[key];
      }
    });
  }

  return (
    <MantineDrawer
      position={placement} /* Recursica default: right; Mantine default: left */
      keepMounted={keepMounted}
      closeOnClickOutside={rest.closeOnClickOutside ?? Boolean(rest.opened)}
      {...(sanitizedProps as unknown as MantineDrawerProps)}
      classNames={mergedClassNames}
    />
  );
};
PanelBase.displayName = "Panel";

// ============================================================
// PANEL FOOTER (custom — Mantine Drawer has no Footer sub-component)
// ============================================================

export type PanelFooterProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLDivElement>
>;

/**
 * Panel footer section with action buttons.
 * Separated from the body by a divider. Remains fixed at the bottom.
 * This is a Recursica-specific sub-component; Mantine Drawer does not
 * natively provide a footer.
 */
export const PanelFooter = forwardRef<HTMLDivElement, PanelFooterProps>(
  function PanelFooter({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    const finalClassName = classNameProp
      ? `${styles.footer} ${classNameProp}`
      : styles.footer;

    return <div ref={ref} className={finalClassName} {...sanitizedProps} />;
  },
);
PanelFooter.displayName = "PanelFooter";

// ============================================================
// PANEL SUB-COMPONENTS (wrapped so overStyled/filterStylingProps applies)
// ============================================================

export type PanelRootProps = RecursicaOverStyled<MantineDrawerRootProps>;

export const PanelRoot = forwardRef<HTMLDivElement, PanelRootProps>(
  function PanelRoot({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Root
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerRootProps)}
      />
    );
  },
);
PanelRoot.displayName = "PanelRoot";

export type PanelOverlayProps = RecursicaOverStyled<MantineDrawerOverlayProps>;

export const PanelOverlay = forwardRef<HTMLDivElement, PanelOverlayProps>(
  function PanelOverlay({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Overlay
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerOverlayProps)}
      />
    );
  },
);
PanelOverlay.displayName = "PanelOverlay";

export type PanelContentProps = RecursicaOverStyled<MantineDrawerContentProps>;

export const PanelContent = forwardRef<HTMLDivElement, PanelContentProps>(
  function PanelContent({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Content
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerContentProps)}
      />
    );
  },
);
PanelContent.displayName = "PanelContent";

export type PanelHeaderProps = RecursicaOverStyled<MantineDrawerHeaderProps>;

export const PanelHeader = forwardRef<HTMLElement, PanelHeaderProps>(
  function PanelHeader({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Header
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerHeaderProps)}
      />
    );
  },
);
PanelHeader.displayName = "PanelHeader";

export type PanelTitleProps = RecursicaOverStyled<MantineDrawerTitleProps>;

export const PanelTitle = forwardRef<HTMLHeadingElement, PanelTitleProps>(
  function PanelTitle({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Title
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerTitleProps)}
      />
    );
  },
);
PanelTitle.displayName = "PanelTitle";

export type PanelCloseButtonProps =
  RecursicaOverStyled<MantineDrawerCloseButtonProps>;

export const PanelCloseButton = forwardRef<
  HTMLButtonElement,
  PanelCloseButtonProps
>(function PanelCloseButton({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MantineDrawer.CloseButton
      ref={ref}
      {...(sanitizedProps as unknown as MantineDrawerCloseButtonProps)}
    />
  );
});
PanelCloseButton.displayName = "PanelCloseButton";

export type PanelBodyProps = RecursicaOverStyled<MantineDrawerBodyProps>;

export const PanelBody = forwardRef<HTMLDivElement, PanelBodyProps>(
  function PanelBody({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineDrawer.Body
        ref={ref}
        {...(sanitizedProps as unknown as MantineDrawerBodyProps)}
      />
    );
  },
);
PanelBody.displayName = "PanelBody";

// ============================================================
// DOT NOTATION EXPORT
// ============================================================

type PanelComponent = typeof PanelBase & {
  Root: typeof PanelRoot;
  Overlay: typeof PanelOverlay;
  Content: typeof PanelContent;
  Header: typeof PanelHeader;
  Title: typeof PanelTitle;
  CloseButton: typeof PanelCloseButton;
  Body: typeof PanelBody;
  Stack: typeof MantineDrawer.Stack;
  Footer: typeof PanelFooter;
};

export const Panel = PanelBase as PanelComponent;
Panel.Root = PanelRoot;
Panel.Overlay = PanelOverlay;
Panel.Content = PanelContent;
Panel.Header = PanelHeader;
Panel.Title = PanelTitle;
Panel.CloseButton = PanelCloseButton;
Panel.Body = PanelBody;
// Panel.Stack (DrawerStack) only accepts `children` — no styling props to
// strip, so re-exporting Mantine's implementation directly is not a gap.
Panel.Stack = MantineDrawer.Stack;
Panel.Footer = PanelFooter;
