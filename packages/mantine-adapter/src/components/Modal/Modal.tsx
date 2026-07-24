import React from "react";
import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
  type ModalRootProps as MantineModalRootProps,
  type ModalOverlayProps as MantineModalOverlayProps,
  type ModalContentProps as MantineModalContentProps,
  type ModalHeaderProps as MantineModalHeaderProps,
  type ModalTitleProps as MantineModalTitleProps,
  type ModalCloseButtonProps as MantineModalCloseButtonProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Modal.module.css";

import { type RecursicaModalProps } from "@recursica/adapter-common";

/**
 * Properties for the strictly-tokenized Modal component.
 * Native Mantine abstract properties like `size`, `radius`, and `shadow` have been stripped out
 * because they directly conflict with the non-negotiable pixel boundaries defined in the Recursica UI Kit.
 */
export type ModalProps = RecursicaOverStyled<
  Omit<MantineModalProps, "size" | "radius" | "shadow"> & RecursicaModalProps
>;

/**
 * The `Modal` component displays a window overlaid on the primary viewport.
 *
 * **Recursica Abstract:**
 * This component acts as a strict structural wrapper around Mantine's `<Modal>`.
 * It automatically enforces Figma UI Kit geometries (`max-width: 960px`, `min-width: 304px`)
 * and handles internal body scrolling explicitly via CSS module overrides.
 *
 * @example
 * ```tsx
 * <Modal opened={opened} onClose={close} title="Hello World">
 *   Modal Content
 * </Modal>
 * ```
 */
const ModalInner = React.forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    overStyled = false,
    children,
    title,
    withCloseButton = true,
    overlayProps,
    withOverlay = true,
    closeButtonProps,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    inner: styles.inner,
    content: styles.content,
    header: styles.header,
    title: styles.title,
    close: styles.close,
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
    <MantineModal.Root
      ref={ref}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as Omit<
        MantineModalProps,
        "size" | "radius" | "shadow"
      >)}
    >
      {withOverlay && <MantineModal.Overlay {...overlayProps} />}
      <MantineModal.Content>
        {(title || withCloseButton) && (
          <MantineModal.Header>
            {title && <MantineModal.Title>{title}</MantineModal.Title>}
            {withCloseButton && (
              <MantineModal.CloseButton {...closeButtonProps} />
            )}
          </MantineModal.Header>
        )}
        <ModalBody>{children}</ModalBody>
      </MantineModal.Content>
    </MantineModal.Root>
  );
});

ModalInner.displayName = "Modal";

/**
 * The `Modal.Footer` provides a perfectly padded container for modal actions.
 *
 * **Recursica Abstract:**
 * By default, this container aligns its children to the right (`justify-content: flex-end`)
 * and applies the standard Figma button-gap spacing.
 *
 * > [!IMPORTANT]
 * > **Button Hierarchy:** Recursica design language explicitly requires that the
 * > primary action button MUST be the right-most element, with the secondary
 * > (outline variant) action placed immediately to the left of it.
 */
export type ModalFooterProps = RecursicaOverStyled<
  React.ComponentPropsWithoutRef<"div">
>;

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ overStyled = false, className, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <div
        ref={ref}
        className={`${styles.footer} ${className || ""}`}
        {...sanitizedProps}
      />
    );
  },
);
ModalFooter.displayName = "Modal.Footer";

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MantineModal.Body>
>(function ModalBody({ className, onScroll, children, ...rest }, ref) {
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

  // Re-check scroll on mount and window resize
  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, children]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    checkScroll();
    onScroll?.(e);
  };

  // Intercept children to pull Modal.Footer out of the scrolling container
  let footer: React.ReactNode = null;
  const bodyChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === ModalFooter ||
        (child.type as React.ComponentType)?.displayName === "Modal.Footer")
    ) {
      footer = child;
    } else {
      bodyChildren.push(child);
    }
  });

  return (
    <MantineModal.Body
      {...rest}
      ref={(node) => {
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.bodyWrapper} ${className || ""}`}
    >
      <div
        ref={internalRef}
        onScroll={handleScroll}
        data-scrolled-top={scrolledTop || undefined}
        data-scrolled-bottom={scrolledBottom || undefined}
        className={styles.scrollArea}
      >
        {bodyChildren}
      </div>
      {footer}
    </MantineModal.Body>
  );
});
ModalBody.displayName = "Modal.Body";

// ============================================================
// MODAL SUB-COMPONENTS (wrapped so overStyled/filterStylingProps applies)
// ============================================================

export type ModalRootProps = RecursicaOverStyled<MantineModalRootProps>;

const ModalRoot = React.forwardRef<HTMLDivElement, ModalRootProps>(
  function ModalRoot({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineModal.Root
        ref={ref}
        {...(sanitizedProps as unknown as MantineModalRootProps)}
      />
    );
  },
);
ModalRoot.displayName = "Modal.Root";

export type ModalOverlayProps = RecursicaOverStyled<MantineModalOverlayProps>;

const ModalOverlay = React.forwardRef<HTMLDivElement, ModalOverlayProps>(
  function ModalOverlay({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineModal.Overlay
        ref={ref}
        {...(sanitizedProps as unknown as MantineModalOverlayProps)}
      />
    );
  },
);
ModalOverlay.displayName = "Modal.Overlay";

export type ModalContentProps = RecursicaOverStyled<MantineModalContentProps>;

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineModal.Content
        ref={ref}
        {...(sanitizedProps as unknown as MantineModalContentProps)}
      />
    );
  },
);
ModalContent.displayName = "Modal.Content";

export type ModalHeaderProps = RecursicaOverStyled<MantineModalHeaderProps>;

const ModalHeader = React.forwardRef<HTMLElement, ModalHeaderProps>(
  function ModalHeader({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineModal.Header
        ref={ref}
        {...(sanitizedProps as unknown as MantineModalHeaderProps)}
      />
    );
  },
);
ModalHeader.displayName = "Modal.Header";

export type ModalTitleProps = RecursicaOverStyled<MantineModalTitleProps>;

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  function ModalTitle({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantineModal.Title
        ref={ref}
        {...(sanitizedProps as unknown as MantineModalTitleProps)}
      />
    );
  },
);
ModalTitle.displayName = "Modal.Title";

export type ModalCloseButtonProps =
  RecursicaOverStyled<MantineModalCloseButtonProps>;

const ModalCloseButton = React.forwardRef<
  HTMLButtonElement,
  ModalCloseButtonProps
>(function ModalCloseButton({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MantineModal.CloseButton
      ref={ref}
      {...(sanitizedProps as unknown as MantineModalCloseButtonProps)}
    />
  );
});
ModalCloseButton.displayName = "Modal.CloseButton";

interface ModalComponent
  extends React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<HTMLDivElement>
  > {
  Root: typeof ModalRoot;
  Overlay: typeof ModalOverlay;
  Content: typeof ModalContent;
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  CloseButton: typeof ModalCloseButton;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
}

export const Modal = ModalInner as ModalComponent & {
  Footer: typeof ModalFooter;
};
Modal.Root = ModalRoot;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.CloseButton = ModalCloseButton;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
