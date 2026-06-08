import React from "react";
import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
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
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function ModalFooter({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={`${styles.footer} ${className || ""}`}
      {...rest}
    />
  );
});
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

interface ModalComponent
  extends React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<HTMLDivElement>
  > {
  Root: typeof MantineModal.Root;
  Overlay: typeof MantineModal.Overlay;
  Content: typeof MantineModal.Content;
  Header: typeof MantineModal.Header;
  Title: typeof MantineModal.Title;
  CloseButton: typeof MantineModal.CloseButton;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
}

export const Modal = ModalInner as ModalComponent & {
  Footer: typeof ModalFooter;
};
Modal.Root = MantineModal.Root;
Modal.Overlay = MantineModal.Overlay;
Modal.Content = MantineModal.Content;
Modal.Header = MantineModal.Header;
Modal.Title = MantineModal.Title;
Modal.CloseButton = MantineModal.CloseButton;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
