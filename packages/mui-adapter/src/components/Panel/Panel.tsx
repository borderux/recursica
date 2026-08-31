import { forwardRef, type ReactNode } from "react";
import {
  Drawer as MuiDrawer,
  type DrawerProps as MuiDrawerProps,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Panel.module.css";

// ============================================================
// PANEL (Drawer)
// ============================================================

import { type RecursicaPanelProps as BaseRecursicaPanelProps } from "@recursica/adapter-common";

/**
 * Recursica Panel root props. Extends Mui Drawer.
 */
export interface RecursicaPanelProps
  extends Omit<
      MuiDrawerProps,
      "classes" | "position" | "style" | "anchor" | "open" | "title"
    >,
    BaseRecursicaPanelProps {
  /** Panel header title label. */
  title?: ReactNode;
  /** Whether to display a background overlay. Default true. */
  withOverlay?: boolean;
  /** Whether to display the close button in the header. Default true. */
  withCloseButton?: boolean;
}

export type PanelProps = RecursicaOverStyled<RecursicaPanelProps>;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/**
 * Recursica Panel component wrapping Mui's Drawer.
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
 * Mui Drawer sub-components available via dot-notation:
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
  wrapHeaderText = true,
  opened,
  title,
  withOverlay = true,
  withCloseButton = true,
  onClose,
  children,
  ...rest
}: PanelProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // MUI Drawer's `classes` prop only recognizes its own slot names (`root`, `paper`,
  // `docked`, ...) — unlike Mantine's `classNames`, it has no `content`/`header`/`title`/`body`
  // slots to bind into. Passing those keys here used to silently no-op every one of them, which
  // is why the panel rendered with none of its Recursica chrome (border, radius, sizing) and no
  // header at all: MUI's raw Drawer has no `title`/`withCloseButton` convenience API the way
  // Mantine's does, so those props were being spread onto the DOM as inert attributes instead of
  // building a header. The box-model/appearance chrome (border, radius, shadow, size bounds) now
  // lives on an explicit `.content` wrapper rendered as Paper's child instead; `.paper` strips
  // MUI's own default Paper appearance so only the wrapper's chrome is visible.
  const mergedClassNames = mergeClassNames(
    { paper: styles.paper },
    (sanitizedProps as Record<string, unknown>).classes as
      | Partial<Record<string, string>>
      | undefined,
  );

  return (
    <MuiDrawer
      anchor={placement} /* Recursica default: right; Mui default: left */
      keepMounted={keepMounted}
      open={Boolean(opened)}
      onClose={onClose}
      hideBackdrop={!withOverlay}
      {...(sanitizedProps as unknown as MuiDrawerProps)}
      classes={mergedClassNames as unknown as MuiDrawerProps["classes"]}
    >
      <div className={styles.content}>
        {(title || withCloseButton) && (
          <div className={styles.header}>
            {title && (
              <div
                className={wrapHeaderText ? styles.titleTruncate : styles.title}
              >
                {title}
              </div>
            )}
            {withCloseButton && (
              <MuiIconButton
                size="small"
                aria-label="Close"
                onClick={(e) => onClose?.(e, "backdropClick")}
                className={styles.close}
              >
                <CloseIcon />
              </MuiIconButton>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </MuiDrawer>
  );
};
PanelBase.displayName = "Panel";

// ============================================================
// PANEL FOOTER (custom — Mui Drawer has no Footer sub-component)
// ============================================================

export type PanelFooterProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLDivElement>
>;

/**
 * Panel footer section with action buttons.
 * Separated from the body by a divider. Remains fixed at the bottom.
 * This is a Recursica-specific sub-component; Mui Drawer does not
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

    return <div ref={ref} {...sanitizedProps} className={finalClassName} />;
  },
);
PanelFooter.displayName = "PanelFooter";

// ============================================================
type PanelComponent = typeof PanelBase & {
  Footer: typeof PanelFooter;
};

export const Panel = PanelBase as PanelComponent;
Panel.Footer = PanelFooter;
