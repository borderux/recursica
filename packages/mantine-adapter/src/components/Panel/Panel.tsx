import { forwardRef } from "react";
import {
  Drawer as MantineDrawer,
  type DrawerProps as MantineDrawerProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Panel.module.css";

// ============================================================
// PANEL (Drawer)
// ============================================================

export interface RecursicaPanelProps extends MantineDrawerProps {
  /**
   * If true, forces the header text to a single line and truncates with an ellipsis.
   * Note: While the prop is named `wrapHeaderText` for backward compatibility,
   * setting it to `true` actually PREVENTS wrapping (it forces truncation).
   */
  wrapHeaderText?: boolean;
}

/**
 * Recursica Panel root props. Extends Mantine Drawer.
 */
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
 * <Panel opened={opened} onClose={close} title="Panel Title" position="right">
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
  position = "right",
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
      position={position} /* Recursica default: right; Mantine default: left */
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
// DOT NOTATION EXPORT
// ============================================================

type PanelComponent = typeof PanelBase & {
  Root: typeof MantineDrawer.Root;
  Overlay: typeof MantineDrawer.Overlay;
  Content: typeof MantineDrawer.Content;
  Header: typeof MantineDrawer.Header;
  Title: typeof MantineDrawer.Title;
  CloseButton: typeof MantineDrawer.CloseButton;
  Body: typeof MantineDrawer.Body;
  Stack: typeof MantineDrawer.Stack;
  Footer: typeof PanelFooter;
};

export const Panel = PanelBase as PanelComponent;
Panel.Root = MantineDrawer.Root;
Panel.Overlay = MantineDrawer.Overlay;
Panel.Content = MantineDrawer.Content;
Panel.Header = MantineDrawer.Header;
Panel.Title = MantineDrawer.Title;
Panel.CloseButton = MantineDrawer.CloseButton;
Panel.Body = MantineDrawer.Body;
Panel.Stack = MantineDrawer.Stack;
Panel.Footer = PanelFooter;
