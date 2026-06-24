import { forwardRef } from "react";
import {
  Card as MantineCard,
  type CardProps as MantineCardProps,
  type CardSectionProps as MantineCardSectionProps,
  createPolymorphicComponent,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Card.module.css";

import {
  type RecursicaCardProps,
  type RecursicaCardSectionProps,
} from "@recursica/adapter-common";

// ==== CARD CONTAINER ====
export type CardProps = RecursicaOverStyled<
  MantineCardProps & RecursicaCardProps
> & {
  flex?: string | number;
  flexGrow?: string | number;
  flexShrink?: string | number;
  flexBasis?: string | number;
  grow?: string | number;
  h?: string | number;
  height?: string | number;
};

/**
 * The root Card elevation box. It establishes the global background color, border radius, nested component gap, and outer shadow governed by the current `Layer` context.
 */
const CardBase = forwardRef<HTMLDivElement, CardProps>(function Card(
  { overStyled = false, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);

  // Expose outer layout/flexbox properties on Card to allow structuring alongside siblings
  const safeCardLayoutKeys = [
    "flex",
    "flexGrow",
    "flexShrink",
    "flexBasis",
    "grow",
    "h",
    "height",
  ] as const;
  safeCardLayoutKeys.forEach((key) => {
    if (key in rest && !(key in sanitizedProps)) {
      (sanitizedProps as any)[key] = (rest as any)[key];
    }
  });

  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
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
    <MantineCard
      ref={ref}
      className={classNameProp}
      classNames={mergedClassNames}
      {...(sanitizedProps as unknown as MantineCardProps)}
    />
  );
});
CardBase.displayName = "Card";

export type CardSectionProps = RecursicaOverStyled<
  MantineCardSectionProps & RecursicaCardSectionProps
>;

/**
 * A generalized edge-to-edge structural wrapper native to Mantine. Strips typical boundary padding via negative margins to allow content (like maps or header images) to touch the border seamlessly.
 */
export const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  function CardSection({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineCard.Section
        ref={ref}
        className={
          classNameProp ? `${styles.section} ${classNameProp}` : styles.section
        }
        {...(sanitizedProps as unknown as MantineCardSectionProps)}
      />
    );
  },
);
CardSection.displayName = "CardSection";

// ==== EXPLICIT CARD.HEADER ====
export type CardHeaderProps = RecursicaOverStyled<RecursicaCardSectionProps>;

/**
 * Replaces standard generic Mantine `<Card.Section>` wrappers by directly injecting the strict Recursica design tokens for header sizing, background drops, and intrinsic padding limits.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineCard.Section
        ref={ref}
        className={
          classNameProp ? `${styles.header} ${classNameProp}` : styles.header
        }
        {...(sanitizedProps as unknown as MantineCardSectionProps)}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

// ==== EXPLICIT CARD.FOOTER ====
export type CardFooterProps = RecursicaOverStyled<RecursicaCardSectionProps>;

/**
 * Counterpart to `Card.Header`, applying specific footer elevation margins, sizes, and padding natively.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <MantineCard.Section
        ref={ref}
        className={
          classNameProp ? `${styles.footer} ${classNameProp}` : styles.footer
        }
        {...(sanitizedProps as unknown as MantineCardSectionProps)}
      />
    );
  },
);
CardFooter.displayName = "CardFooter";

// ==== EXPLICIT CARD.CONTENT ====
export type CardContentProps = RecursicaOverStyled<
  React.HTMLAttributes<HTMLDivElement>
>;

/**
 * Internal container that safely binds typography and structural flex gaps driven by the active UI kit tokens natively, preserving correct padding blocks compared to rigid `Card.Section` edges.
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const classNameProp = (sanitizedProps as Record<string, unknown>)
      .className as string | undefined;

    return (
      <div
        ref={ref}
        className={
          classNameProp ? `${styles.content} ${classNameProp}` : styles.content
        }
        {...sanitizedProps}
      />
    );
  },
);
CardContent.displayName = "CardContent";

// ==== DOT NOTATION EXPORT ====

/**
 * Recursica Card component wrapping Mantine's Card (Paper).
 *
 * Supports polymorphism via the `component` prop or `renderRoot` for custom element rendering.
 * Use dot-notation sub-components for structured card layouts.
 */
const PolymorphicCard = createPolymorphicComponent<
  "div",
  CardProps,
  {
    Section: typeof CardSection;
    Header: typeof CardHeader;
    Footer: typeof CardFooter;
    Content: typeof CardContent;
  }
>(CardBase);

// Attach static components for dot-notation access
const _card = PolymorphicCard as unknown as Record<string, unknown>;
_card.Section = CardSection;
_card.Header = CardHeader;
_card.Footer = CardFooter;
_card.Content = CardContent;

export const Card = PolymorphicCard as typeof PolymorphicCard & {
  Section: typeof CardSection;
  Header: typeof CardHeader;
  Footer: typeof CardFooter;
  Content: typeof CardContent;
};
