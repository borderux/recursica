/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Pagination as MuiPagination,
  type PaginationProps as MuiPaginationProps,
  type PaginationRootProps as MuiPaginationRootProps,
} from "@mui/material";
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

export type PaginationProps = RecursicaOverStyled<MuiPaginationProps> & {
  /** If set to true, displays text labels alongside the icons for next/previous/first/last edges. */
  withLabels?: boolean;
};

export type PaginationRootProps = RecursicaOverStyled<MuiPaginationRootProps>;

export type PaginationEdgeProps<T extends React.ElementType> =
  React.ComponentProps<T> & {
    /** If set to true, displays text labels alongside the icon. */
    withLabel?: boolean;
    icon?: any;
  };

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
      <MuiPagination.Root
        ref={ref}
        className={stylingParams.className}
        classes={stylingParams.classNames}
        {...(sanitizedProps as MuiPaginationRootProps)}
      />
    );
  },
);
_PaginationRoot.displayName = "Pagination.Root";

const _PaginationNext = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MuiPagination.Next>
>(function PaginationNext({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? NextWithLabel : undefined);
  return (
    <MuiPagination.Next
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...props}
    />
  );
});
_PaginationNext.displayName = "Pagination.Next";

const _PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MuiPagination.Previous>
>(function PaginationPrevious({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? PrevWithLabel : undefined);
  return (
    <MuiPagination.Previous
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...props}
    />
  );
});
_PaginationPrevious.displayName = "Pagination.Previous";

const _PaginationFirst = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MuiPagination.First>
>(function PaginationFirst({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? FirstWithLabel : undefined);
  return (
    <MuiPagination.First
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...props}
    />
  );
});
_PaginationFirst.displayName = "Pagination.First";

const _PaginationLast = forwardRef<
  HTMLButtonElement,
  PaginationEdgeProps<typeof MuiPagination.Last>
>(function PaginationLast({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? LastWithLabel : undefined);
  return (
    <MuiPagination.Last
      ref={ref}
      data-variant="text"
      icon={renderIcon as any}
      {...props}
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
      <MuiPagination
        ref={ref}
        className={stylingParams.className}
        classes={stylingParams.classNames}
        getControlProps={mergedGetControlProps}
        {...labelsIcons}
        {...(sanitizedProps as MuiPaginationProps)}
      />
    );
  },
);
_Pagination.displayName = "Pagination";

/**
 * Recursica Pagination component wrapping Mui's Pagination.
 */
export const Pagination = _Pagination as typeof _Pagination & {
  Root: typeof _PaginationRoot;
  Items: typeof MuiPagination.Items;
  Control: typeof MuiPagination.Control;
  Dots: typeof MuiPagination.Dots;
  Next: typeof _PaginationNext;
  Previous: typeof _PaginationPrevious;
  First: typeof _PaginationFirst;
  Last: typeof _PaginationLast;
  Icon: typeof PaginationIcon;
};

Pagination.Root = _PaginationRoot;
Pagination.Items = MuiPagination.Items;
Pagination.Control = MuiPagination.Control;
Pagination.Dots = MuiPagination.Dots;
Pagination.Next = _PaginationNext;
Pagination.Previous = _PaginationPrevious;
Pagination.First = _PaginationFirst;
Pagination.Last = _PaginationLast;
Pagination.Icon = PaginationIcon;
