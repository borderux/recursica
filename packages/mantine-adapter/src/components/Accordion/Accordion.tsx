import React, { forwardRef } from "react";
import {
  Accordion as MantineAccordion,
  type AccordionProps as MantineAccordionProps,
  type AccordionItemProps,
  type AccordionControlProps,
  type AccordionPanelProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Accordion.module.css";

// ==== ACCORDION CONTAINER ====
export type AccordionProps = RecursicaOverStyled<MantineAccordionProps>;

const AccordionBase = function Accordion({
  variant = "unstyled",
  overStyled = false,
  ...rest
}: AccordionProps) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Bind all deep CSS module references natively into the global class mapping schema
  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    item: styles.item,
    control: styles.control,
    label: styles.label,
    chevron: styles.chevron,
    panel: styles.panel,
    content: styles.content,
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

  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineAccordion
      variant={variant}
      className={classNameProp}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantineAccordionProps)}
    />
  );
};
AccordionBase.displayName = "Accordion";

// ==== ACCORDION ITEM ====
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RecursicaAccordionItemProps
  extends Omit<AccordionItemProps, "className"> {}
// We need to omit and re-merge native props like in Badge
export type AccordionItemWrapperProps = RecursicaOverStyled<
  AccordionItemProps & {
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
  }
>;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionItemWrapperProps
>(function AccordionItem(
  { title, leftIcon, divider = true, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const finalClass =
    [divider ? undefined : styles.noDivider, classNameProp]
      .filter(Boolean)
      .join(" ") || undefined;

  // If the user utilizes the explicit 'title' prop from Recursica, we securely auto-construct the Mantine sub-hierarchy natively!
  // If not, we defer to raw composable children (meaning the integrator maps `<Accordion.Control>` manually).
  return (
    <MantineAccordion.Item
      ref={ref}
      className={finalClass}
      {...(sanitizedProps as unknown as AccordionItemProps)}
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
export type AccordionControlWrapperProps = RecursicaOverStyled<
  AccordionControlProps & {
    /**
     * Leading icon explicitly mapped into the Mantine `Accordion.Control` leftSection boundary natively.
     */
    leftIcon?: React.ReactNode;
  }
>;

export const AccordionControl = forwardRef<
  HTMLButtonElement,
  AccordionControlWrapperProps
>(function AccordionControl(
  { leftIcon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineAccordion.Control
      ref={ref}
      className={classNameProp}
      icon={
        leftIcon ? (
          <span className={styles.iconLeftWrapper} aria-hidden>
            {leftIcon}
          </span>
        ) : undefined
      }
      {...(sanitizedProps as unknown as AccordionControlProps)}
    >
      {children}
    </MantineAccordion.Control>
  );
});
AccordionControl.displayName = "AccordionControl";

// ==== ACCORDION PANEL ====
export type AccordionPanelWrapperProps =
  RecursicaOverStyled<AccordionPanelProps>;

export const AccordionPanel = forwardRef<
  HTMLDivElement,
  AccordionPanelWrapperProps
>(function AccordionPanel({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineAccordion.Panel
      ref={ref}
      className={classNameProp}
      {...(sanitizedProps as unknown as AccordionPanelProps)}
    />
  );
});
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
