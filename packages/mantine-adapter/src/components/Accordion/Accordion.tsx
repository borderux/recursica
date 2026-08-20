import { forwardRef } from "react";
import {
  Accordion as MantineAccordion,
  type AccordionProps as MantineAccordionProps,
  type AccordionItemProps,
  type AccordionControlProps,
  type AccordionPanelProps,
} from "@mantine/core";
import {
  filterStylingProps,
  omitUnsupportedProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Accordion.module.css";

import {
  type RecursicaAccordionProps,
  type RecursicaAccordionItemProps,
  type RecursicaAccordionControlProps,
  type RecursicaAccordionPanelProps,
} from "@recursica/adapter-common";

// ==== ACCORDION CONTAINER ====
export type AccordionProps = RecursicaOverStyled<
  Omit<
    MantineAccordionProps,
    "value" | "defaultValue" | "onChange" | "multiple" | "variant"
  > &
    RecursicaAccordionProps
>;

// Maps Recursica's public variant vocabulary to Mantine's own. `unstyled` is a Mantine
// sentinel with no meaning to Recursica consumers — it exists only to suppress Mantine's
// built-in variant CSS so our module CSS is the sole source of styling. Anything outside
// this map (a caller-supplied custom variant string) passes straight through to Mantine.
const mapVariant: Record<string, string> = {
  default: "unstyled",
};

const AccordionBase = function Accordion({
  variant = "default",
  overStyled = false,
  ...rest
}: AccordionProps) {
  const resolvedVariant =
    typeof variant === "string" && mapVariant[variant]
      ? mapVariant[variant]
      : variant;

  const sanitizedProps = filterStylingProps(rest, overStyled);
  const restRecord = sanitizedProps as Record<string, unknown>;

  // Bind all deep CSS module references natively into the global class mapping schema
  const mergedClassNames = mergeClassNames(
    {
      root: styles.root,
      item: styles.item,
      control: styles.control,
      label: styles.label,
      chevron: styles.chevron,
      icon: styles.icon,
      panel: styles.panel,
      content: styles.content,
    },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;

  return (
    <MantineAccordion
      {...(sanitizedProps as unknown as MantineAccordionProps)}
      variant={resolvedVariant as MantineAccordionProps["variant"]}
      className={classNameProp}
      classNames={mergedClassNames}
    />
  );
};
AccordionBase.displayName = "Accordion";

// We need to omit and re-merge native props like in Badge
export type AccordionItemWrapperProps = RecursicaOverStyled<
  AccordionItemProps & RecursicaAccordionItemProps
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
    disabled = false,
    overStyled = false,
    ...rest
  },
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
  // `disabled` has no native concept at the Item level — only Control has a real `disabled`
  // prop (it renders a `<button>`, so the native HTML `disabled` attribute alone blocks click,
  // focus, and keyboard activation with no extra guards needed). We forward it there in the
  // auto-composed path; a manually-composed `<Accordion.Control>` needs it passed explicitly.
  return (
    <MantineAccordion.Item
      ref={ref}
      {...(sanitizedProps as unknown as AccordionItemProps)}
      className={finalClass}
      data-disabled={disabled || undefined}
    >
      {title ? (
        <>
          <AccordionControl leftIcon={leftIcon} disabled={disabled}>
            {title}
          </AccordionControl>
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
  // Mantine's native `icon` slot is resolved internally from `leftIcon` — omitted so a
  // caller can't silently override it by passing `icon` directly. Mantine's per-control
  // `chevron` override is left as-is; nothing here computes it, so it passes through safely.
  Omit<AccordionControlProps, "icon"> & RecursicaAccordionControlProps
>;

// Props this component intentionally doesn't support — deleted at runtime so they can't leak
// through even if a caller forces them via plain JavaScript, bypassing the `Omit<>` above.
const UNSUPPORTED_PROPS = [
  "icon", // Mantine's native icon slot is fully computed here from `leftIcon`; the `Omit<>` on
  // AccordionControlWrapperProps only stops a well-typed caller, this is the runtime backstop.
] as const satisfies readonly (keyof AccordionControlProps)[];

export const AccordionControl = forwardRef<
  HTMLButtonElement,
  AccordionControlWrapperProps
>(function AccordionControl(
  { leftIcon, children, overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = omitUnsupportedProps(
    filterStylingProps(rest, overStyled),
    UNSUPPORTED_PROPS,
  );
  const classNameProp = (sanitizedProps as Record<string, unknown>)
    .className as string | undefined;

  return (
    <MantineAccordion.Control
      ref={ref}
      {...(sanitizedProps as unknown as AccordionControlProps)}
      className={classNameProp}
      icon={
        leftIcon ? (
          <span className={styles.iconLeftWrapper} aria-hidden>
            {leftIcon}
          </span>
        ) : undefined
      }
    >
      {children}
    </MantineAccordion.Control>
  );
});
AccordionControl.displayName = "AccordionControl";

// ==== ACCORDION PANEL ====
export type AccordionPanelWrapperProps = RecursicaOverStyled<
  AccordionPanelProps & RecursicaAccordionPanelProps
>;

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
      {...(sanitizedProps as unknown as AccordionPanelProps)}
      className={classNameProp}
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
