import React, { forwardRef } from "react";
import {
  Dialog as MuiDialog,
  type DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  type DialogTitleProps as MuiDialogTitleProps,
  DialogContent as MuiDialogContent,
  type DialogContentProps as MuiDialogContentProps,
  DialogActions as MuiDialogActions,
  type DialogActionsProps as MuiDialogActionsProps,
  IconButton as MuiIconButton,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Modal.module.css";

// ============================================================
// MODAL ROOT (Dialog)
// ============================================================

import { type RecursicaModalProps } from "@recursica/adapter-common";

export type ModalProps = RecursicaOverStyled<
  Omit<MuiDialogProps, "size" | "radius" | "shadow" | "open"> &
    RecursicaModalProps
>;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const ModalRoot = forwardRef<HTMLDivElement, ModalProps>(function ModalRoot(
  {
    overStyled = false,
    opened = false,
    withCloseButton = true,
    title,
    children,
    onClose,
    className,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const mergedClassNames = mergeClassNames(
    { paper: styles.inner },
    (sanitizedProps as Record<string, unknown>).classes as
      | Partial<Record<string, string>>
      | undefined,
  );

  let footer: React.ReactNode = null;
  const bodyChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === ModalFooter ||
        (child.type as unknown as { displayName?: string })?.displayName ===
          "Modal.Footer")
    ) {
      footer = child;
    } else {
      bodyChildren.push(child);
    }
  });

  return (
    <MuiDialog
      ref={ref}
      {...(sanitizedProps as MuiDialogProps)}
      className={`${styles.root} ${className || ""}`}
      classes={mergedClassNames}
      open={
        opened ||
        ((sanitizedProps as Record<string, unknown>).open as boolean) ||
        false
      }
      onClose={onClose}
    >
      {(title || withCloseButton) && (
        <div className={styles.header}>
          {title && <div className={styles.title}>{title}</div>}
          {withCloseButton && (
            <MuiIconButton
              onClick={(e) => onClose?.(e, "backdropClick")}
              className={styles.close}
            >
              <CloseIcon />
            </MuiIconButton>
          )}
        </div>
      )}
      <ModalBody>{bodyChildren}</ModalBody>
      {footer}
    </MuiDialog>
  );
});

ModalRoot.displayName = "Modal";

// ============================================================
// MODAL TITLE (DialogTitle)
// ============================================================

export type ModalTitleProps = RecursicaOverStyled<MuiDialogTitleProps>;

const ModalTitle = forwardRef<HTMLDivElement, ModalTitleProps>(
  function ModalTitle({ overStyled = false, className, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiDialogTitle
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...(sanitizedProps as MuiDialogTitleProps)}
        className={`${styles.title} ${className || ""}`}
      />
    );
  },
);

ModalTitle.displayName = "Modal.Title";

// ============================================================
// MODAL BODY (DialogContent)
// ============================================================

export type ModalBodyProps = RecursicaOverStyled<MuiDialogContentProps>;

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { overStyled = false, className, children, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const internalRef = React.useRef<HTMLDivElement>(null);
  const [scrolledTop, setScrolledTop] = React.useState(false);
  const [scrolledBottom, setScrolledBottom] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    if (internalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = internalRef.current;
      setScrolledTop(scrollTop > 0);
      setScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, children]);

  return (
    <MuiDialogContent
      ref={(node) => {
        if (typeof ref === "function") ref(node as HTMLDivElement);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current =
            node as HTMLDivElement;
        if (internalRef)
          (
            internalRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node as HTMLDivElement;
      }}
      {...(sanitizedProps as MuiDialogContentProps)}
      onScroll={() => checkScroll()}
      data-scrolled-top={scrolledTop || undefined}
      data-scrolled-bottom={scrolledBottom || undefined}
      className={`${styles.content} ${styles.scrollArea} ${className || ""}`}
    >
      {children}
    </MuiDialogContent>
  );
});

ModalBody.displayName = "Modal.Body";

// ============================================================
// MODAL FOOTER (DialogActions)
// ============================================================

export type ModalFooterProps = RecursicaOverStyled<MuiDialogActionsProps>;

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ overStyled = false, className, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);

    return (
      <MuiDialogActions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...(sanitizedProps as MuiDialogActionsProps)}
        className={`${styles.footer} ${className || ""}`}
      />
    );
  },
);

ModalFooter.displayName = "Modal.Footer";

// ============================================================
// EXPORT COMPOSITION
// ============================================================

export const Modal = ModalRoot as typeof ModalRoot & {
  Title: typeof ModalTitle;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
