import React, { forwardRef, createContext, useContext, useState } from "react";
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  type AccordionProps as MuiAccordionProps,
  type AccordionSummaryProps as MuiAccordionSummaryProps,
  type AccordionDetailsProps as MuiAccordionDetailsProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Accordion.module.css";

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const AccordionContext = createContext<{
  value: string | string[] | null;
  onChange: (val: string) => void;
} | null>(null);

// ==== ACCORDION CONTAINER ====
export type AccordionProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: string;
    value?: string | string[];
    defaultValue?: string | string[];
    onChange?: (value: string | string[] | null) => void;
    multiple?: boolean;
  }
>;

const AccordionBase = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      variant = "unstyled",
      overStyled = false,
      value,
      defaultValue,
      onChange,
      multiple = false,
      children,
      ...rest
    },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    const finalClass =
      [styles.root, classNameProp].filter(Boolean).join(" ") || undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | string[] | null
    >(defaultValue !== undefined ? defaultValue : multiple ? [] : null);
    const activeValue = value !== undefined ? value : uncontrolledValue;

    const handleItemChange = (itemValue: string) => {
      let newValue: string | string[] | null;
      if (multiple) {
        const arr = Array.isArray(activeValue)
          ? activeValue
          : activeValue
            ? [activeValue as string]
            : [];
        newValue = arr.includes(itemValue)
          ? arr.filter((v) => v !== itemValue)
          : [...arr, itemValue];
      } else {
        newValue = activeValue === itemValue ? null : itemValue;
      }
      setUncontrolledValue(newValue);
      onChange?.(newValue);
    };

    return (
      <AccordionContext.Provider
        value={{ value: activeValue, onChange: handleItemChange }}
      >
        <div
          ref={ref}
          className={finalClass}
          data-variant={variant}
          {...(sanitizedProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
AccordionBase.displayName = "Accordion";

// ==== ACCORDION ITEM ====
export type AccordionItemWrapperProps = RecursicaOverStyled<
  Omit<MuiAccordionProps, "children" | "value"> & {
    children?: React.ReactNode;
    title?: React.ReactNode;
    leftIcon?: React.ReactNode;
    divider?: boolean;
    value: string;
  }
>;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionItemWrapperProps
>(function AccordionItem(
  {
    title,
    leftIcon,
    divider = true,
    children,
    value,
    overStyled = false,
    style,
    ...rest
  },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const finalClass =
    [styles.item, divider ? undefined : styles.noDivider, classNameProp]
      .filter(Boolean)
      .join(" ") || undefined;

  const ctx = useContext(AccordionContext);
  const isExpanded = ctx
    ? Array.isArray(ctx.value)
      ? ctx.value.includes(value)
      : ctx.value === value
    : undefined;

  const handleChange = () => {
    ctx?.onChange(value);
  };

  // background-color: transparent allows Layer overrides to naturally penetrate
  const mergedStyle = { backgroundColor: "transparent", ...style };

  return (
    <MuiAccordion
      ref={ref}
      className={finalClass}
      disableGutters
      elevation={0}
      square
      expanded={isExpanded}
      onChange={handleChange}
      style={mergedStyle}
      {...(sanitizedProps as unknown as Omit<
        MuiAccordionProps,
        "expanded" | "onChange"
      >)}
    >
      {
        (title ? (
          <>
            <AccordionControl leftIcon={leftIcon}>{title}</AccordionControl>
            <AccordionPanel>{children}</AccordionPanel>
          </>
        ) : (
          children
        )) as any
      }
    </MuiAccordion>
  );
});
AccordionItem.displayName = "AccordionItem";

// ==== ACCORDION CONTROL ====
export type AccordionControlWrapperProps = RecursicaOverStyled<
  MuiAccordionSummaryProps & {
    leftIcon?: React.ReactNode;
  }
>;

export const AccordionControl = forwardRef<
  HTMLDivElement,
  AccordionControlWrapperProps
>(function AccordionControl(
  { leftIcon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const finalClass =
    [styles.control, classNameProp].filter(Boolean).join(" ") || undefined;

  return (
    <MuiAccordionSummary
      ref={ref}
      className={finalClass}
      expandIcon={
        <span className={styles.chevron}>
          <ChevronIcon />
        </span>
      }
      {...(sanitizedProps as unknown as MuiAccordionSummaryProps)}
    >
      {leftIcon && (
        <span className={styles.iconLeftWrapper} aria-hidden>
          {leftIcon}
        </span>
      )}
      <div className={styles.label}>{children}</div>
    </MuiAccordionSummary>
  );
});
AccordionControl.displayName = "AccordionControl";

// ==== ACCORDION PANEL ====
export type AccordionPanelWrapperProps =
  RecursicaOverStyled<MuiAccordionDetailsProps>;

export const AccordionPanel = forwardRef<
  HTMLDivElement,
  AccordionPanelWrapperProps
>(function AccordionPanel({ overStyled = false, children, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  const finalClass =
    [styles.panel, classNameProp].filter(Boolean).join(" ") || undefined;

  return (
    <MuiAccordionDetails
      ref={ref}
      className={finalClass}
      {...(sanitizedProps as unknown as MuiAccordionDetailsProps)}
    >
      <div className={styles.content}>{children}</div>
    </MuiAccordionDetails>
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
