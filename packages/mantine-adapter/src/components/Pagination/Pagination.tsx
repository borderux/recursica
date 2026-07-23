/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Pagination as MantinePagination,
  type PaginationProps as MantinePaginationProps,
  type PaginationRootProps as MantinePaginationRootProps,
  type PaginationControlProps as MantinePaginationControlProps,
  type PaginationDotsProps as MantinePaginationDotsProps,
} from "@mantine/core";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Pagination.module.css";
import {
  NextWithLabel,
  PrevWithLabel,
  FirstWithLabel,
  LastWithLabel,
  PaginationIcon,
} from "./Pagination.icons";

import { type RecursicaPaginationProps } from "@recursica/adapter-common";

export type PaginationProps = RecursicaOverStyled<
  MantinePaginationProps & RecursicaPaginationProps
>;

export type PaginationRootProps =
  RecursicaOverStyled<MantinePaginationRootProps>;

export type PaginationEdgeProps<T extends React.ElementType> =
  RecursicaOverStyled<
    React.ComponentProps<T> & {
      /** If set to true, displays text labels alongside the icon. */
      withLabel?: boolean;
      icon?: any;
    }
  >;

function usePaginationClassNames(restRecord: Record<string, unknown>): {
  className: string;
  classNames: Partial<Record<string, string>>;
} {
  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    control: styles.control,
    dots: styles.dots,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.control = o.control
      ? `${styles.control} ${o.control}`
      : styles.control;
    mergedClassNames.dots = o.dots ? `${styles.dots} ${o.dots}` : styles.dots;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return { className: finalClass, classNames: mergedClassNames };
}

const _PaginationRoot = forwardRef<HTMLDivElement, PaginationRootProps>(
  function PaginationRoot({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const stylingParams = usePaginationClassNames(
      sanitizedProps as Record<string, unknown>,
    );

    return (
      <MantinePagination.Root
        ref={ref}
        className={stylingParams.className}
        classNames={stylingParams.classNames}
        {...(sanitizedProps as MantinePaginationRootProps)}
      />
    );
  },
);
_PaginationRoot.displayName = "Pagination.Root";

const _PaginationNext = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MantinePagination.Next>
>(function PaginationNext(
  { overStyled = false, withLabel, icon, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const renderIcon = icon || (withLabel ? NextWithLabel : undefined);
  return (
    <MantinePagination.Next
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...sanitizedProps}
    />
  );
});
_PaginationNext.displayName = "Pagination.Next";

const _PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MantinePagination.Previous>
>(function PaginationPrevious(
  { overStyled = false, withLabel, icon, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const renderIcon = icon || (withLabel ? PrevWithLabel : undefined);
  return (
    <MantinePagination.Previous
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...sanitizedProps}
    />
  );
});
_PaginationPrevious.displayName = "Pagination.Previous";

const _PaginationFirst = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MantinePagination.First>
>(function PaginationFirst(
  { overStyled = false, withLabel, icon, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const renderIcon = icon || (withLabel ? FirstWithLabel : undefined);
  return (
    <MantinePagination.First
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...sanitizedProps}
    />
  );
});
_PaginationFirst.displayName = "Pagination.First";

const _PaginationLast = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MantinePagination.Last>
>(function PaginationLast(
  { overStyled = false, withLabel, icon, ...rest },
  ref,
) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  const renderIcon = icon || (withLabel ? LastWithLabel : undefined);
  return (
    <MantinePagination.Last
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...sanitizedProps}
    />
  );
});
_PaginationLast.displayName = "Pagination.Last";

const _Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(
    { overStyled = false, getControlProps, withLabels, ...rest },
    ref,
  ) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    const stylingParams = usePaginationClassNames(
      sanitizedProps as Record<string, unknown>,
    );

    const mergedGetControlProps = (
      control: "first" | "previous" | "last" | "next",
    ) => {
      const baseProps = { "data-variant": "text" };
      if (getControlProps) {
        return { ...baseProps, ...getControlProps(control) };
      }
      return baseProps;
    };

    const labelsIcons = withLabels
      ? {
          nextIcon: NextWithLabel,
          previousIcon: PrevWithLabel,
          firstIcon: FirstWithLabel,
          lastIcon: LastWithLabel,
        }
      : {};

    return (
      <MantinePagination
        ref={ref}
        className={stylingParams.className}
        classNames={stylingParams.classNames}
        getControlProps={mergedGetControlProps}
        {...labelsIcons}
        {...(sanitizedProps as MantinePaginationProps)}
      />
    );
  },
);
_Pagination.displayName = "Pagination";

export type PaginationControlProps =
  RecursicaOverStyled<MantinePaginationControlProps>;

const _PaginationControl = forwardRef<
  HTMLButtonElement,
  PaginationControlProps
>(function PaginationControl({ overStyled = false, ...rest }, ref) {
  const sanitizedProps = filterStylingProps(rest, overStyled);
  return (
    <MantinePagination.Control
      ref={ref}
      {...(sanitizedProps as unknown as MantinePaginationControlProps)}
    />
  );
});
_PaginationControl.displayName = "Pagination.Control";

export type PaginationDotsProps =
  RecursicaOverStyled<MantinePaginationDotsProps>;

const _PaginationDots = forwardRef<HTMLDivElement, PaginationDotsProps>(
  function PaginationDots({ overStyled = false, ...rest }, ref) {
    const sanitizedProps = filterStylingProps(rest, overStyled);
    return (
      <MantinePagination.Dots
        ref={ref}
        {...(sanitizedProps as unknown as MantinePaginationDotsProps)}
      />
    );
  },
);
_PaginationDots.displayName = "Pagination.Dots";

/**
 * Recursica Pagination component wrapping Mantine's Pagination.
 */
export const Pagination = _Pagination as typeof _Pagination & {
  Root: typeof _PaginationRoot;
  Items: typeof MantinePagination.Items;
  Control: typeof _PaginationControl;
  Dots: typeof _PaginationDots;
  Next: typeof _PaginationNext;
  Previous: typeof _PaginationPrevious;
  First: typeof _PaginationFirst;
  Last: typeof _PaginationLast;
  Icon: typeof PaginationIcon;
};

Pagination.Root = _PaginationRoot;
// Pagination.Items has no styling props of its own (just a `dotsIcon` prop, no
// `style`/`className`/BoxProps), so re-exporting Mantine's implementation
// directly is not a styling-gate gap.
Pagination.Items = MantinePagination.Items;
Pagination.Control = _PaginationControl;
Pagination.Dots = _PaginationDots;
Pagination.Next = _PaginationNext;
Pagination.Previous = _PaginationPrevious;
Pagination.First = _PaginationFirst;
Pagination.Last = _PaginationLast;
Pagination.Icon = PaginationIcon;
