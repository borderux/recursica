import React from "react";
import {
  Modal as MuiModal,
  type ModalProps as MuiModalProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Modal.module.css";

/**
 * Properties for the strictly-tokenized Modal component.
 * Native Mui abstract properties like `size`, `radius`, and `shadow` have been stripped out
 * because they directly conflict with the non-negotiable pixel boundaries defined in the Recursica UI Kit.
 */
export type ModalProps = RecursicaOverStyled<
  Omit<MuiModalProps, "size" | "radius" | "shadow">
>;

/**
 * The `Modal` component displays a window overlaid on the primary viewport.
 *
 * **Recursica Abstract:**
 * This component acts as a strict structural wrapper around Mui's `<Modal>`.
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
    <div
      ref={ref}
      classes={mergedClassNames}
      {...(sanitizedProps as unknown as Omit<
        MuiModalProps,
        "size" | "radius" | "shadow"
      >)}
    >
      {withOverlay && <div {...overlayProps} />}
      <div>
        {(title || withCloseButton) && (
          <div>
            {title && <div>{title}</div>}
            {withCloseButton && <div {...closeButtonProps} />}
          </div>
        )}
        <ModalBody>{children}</ModalBody>
      </div>
    </div>
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
  React.ComponentPropsWithoutRef<typeof MuiModal.Body>
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
    <div
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
    </div>
  );
});
ModalBody.displayName = "Modal.Body";

interface ModalComponent
  extends React.ForwardRefExoticComponent<
    ModalProps & React.RefAttributes<HTMLDivElement>
  > {
  Root: typeof MuiModal.Root;
  Overlay: typeof MuiModal.Overlay;
  Content: typeof MuiModal.Content;
  Header: typeof MuiModal.Header;
  Title: typeof MuiModal.Title;
  CloseButton: typeof MuiModal.CloseButton;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
}

export const Modal = ModalInner as ModalComponent & {
  Footer: typeof ModalFooter;
};
Modal.Root = MuiModal.Root;
Modal.Overlay = MuiModal.Overlay;
Modal.Content = MuiModal.Content;
Modal.Header = MuiModal.Header;
Modal.Title = MuiModal.Title;
Modal.CloseButton = MuiModal.CloseButton;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
