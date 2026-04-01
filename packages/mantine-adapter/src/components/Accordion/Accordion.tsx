import React, { forwardRef } from "react";
import {
  Accordion as MantineAccordion,
  type AccordionProps as MantineAccordionProps,
  type AccordionItemProps,
  type AccordionControlProps,
  type AccordionPanelProps,
} from "@mantine/core";
import styles from "./Accordion.module.css";

// ==== ACCORDION CONTAINER ====
export type AccordionProps = MantineAccordionProps;

const AccordionBase = function Accordion({
  className,
  classNames,
  variant = "unstyled",
  ...rest
}: AccordionProps) {
  // Bind all deep CSS module references natively into the global class mapping schema
  const mergedClassNames: Record<string, string> = {
    root: styles.root,
    item: styles.item,
    control: styles.control,
    label: styles.label,
    chevron: styles.chevron,
    panel: styles.panel,
    content: styles.content,
  };

  if (
    classNames &&
    typeof classNames === "object" &&
    !Array.isArray(classNames)
  ) {
    const o = classNames as Record<string, string>;
    Object.keys(o).forEach((key) => {
      if (mergedClassNames[key]) {
        mergedClassNames[key] = `${mergedClassNames[key]} ${o[key]}`;
      } else {
        mergedClassNames[key] = o[key];
      }
    });
  }

  return (
    <MantineAccordion
      variant={variant}
      className={className}
      classNames={mergedClassNames}
      {...rest}
    />
  );
};
AccordionBase.displayName = "Accordion";

// ==== ACCORDION ITEM ====
export type RecursicaAccordionItemProps = AccordionItemProps & {
  /**
   * When provided alongside `leftIcon` or independently, this auto-generates the Accordion Control and Panel DOM layers natively.
   */
  title?: React.ReactNode;

  /**
   * Leading icon explicitly mapped into the Mantine `Accordion.Control` leftSection boundary natively.
   */
  leftIcon?: React.ReactNode;

  /**
   * Toggles the presence of the bottom trailing divider native to AccordionItems.
   * @default true
   */
  divider?: boolean;

  // Note on `open` property:
  // Recursica structurally maps an `open` property for active state tracking. However, Mantine inherently demands array-driven states
  // managed by the parent `<Accordion value="...">` wrapper logic to accurately sequence expanding DOM animations. Attempting to force
  // an isolated `open` boolean natively corrupts Mantine's transition observers, so no `open` prop is directly preserved on this wrapper.
};

export const AccordionItem = forwardRef<
  HTMLDivElement,
  RecursicaAccordionItemProps
>(function AccordionItem(
  { title, leftIcon, divider = true, children, ...rest },
  ref,
) {
  // If the user utilizes the explicit 'title' prop from Recursica, we securely auto-construct the Mantine sub-hierarchy natively!
  // If not, we defer to raw composable children (meaning the integrator maps `<Accordion.Control>` manually).
  return (
    <MantineAccordion.Item
      ref={ref}
      className={divider ? undefined : styles.noDivider}
      {...rest}
    >
      {title ? (
        <>
          <AccordionControl leftIcon={leftIcon}>{title}</AccordionControl>
          <AccordionPanel>{children}</AccordionPanel>
        </>
      ) : (
        children
      )}
    </MantineAccordion.Item>
  );
});
AccordionItem.displayName = "AccordionItem";

// ==== ACCORDION CONTROL ====
export type RecursicaAccordionControlProps = AccordionControlProps & {
  /**
   * Leading icon explicitly mapped into the Mantine `Accordion.Control` leftSection boundary natively.
   */
  leftIcon?: React.ReactNode;
};

export const AccordionControl = forwardRef<
  HTMLButtonElement,
  RecursicaAccordionControlProps
>(function AccordionControl({ leftIcon, children, ...rest }, ref) {
  return (
    <MantineAccordion.Control
      ref={ref}
      icon={
        leftIcon ? (
          <span className={styles.iconLeftWrapper} aria-hidden>
            {leftIcon}
          </span>
        ) : undefined
      }
      {...rest}
    >
      {children}
    </MantineAccordion.Control>
  );
});
AccordionControl.displayName = "AccordionControl";

// ==== ACCORDION PANEL ====
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel(props, ref) {
    return <MantineAccordion.Panel ref={ref} {...props} />;
  },
);
AccordionPanel.displayName = "AccordionPanel";

// ==== DOT NOTATION EXPORT ====
type AccordionComponent = typeof AccordionBase & {
  Item: typeof AccordionItem;
  Control: typeof AccordionControl;
  Panel: typeof AccordionPanel;
};

export const Accordion = AccordionBase as AccordionComponent;
Accordion.Item = AccordionItem;
Accordion.Control = AccordionControl;
Accordion.Panel = AccordionPanel;
