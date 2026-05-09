/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import {
  Pagination as MantinePagination,
  type PaginationProps as MantinePaginationProps,
  type PaginationRootProps as MantinePaginationRootProps,
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

export type PaginationProps = RecursicaOverStyled<MantinePaginationProps> & {
  /** If set to true, displays text labels alongside the icons for next/previous/first/last edges. */
  withLabels?: boolean;
};

export type PaginationRootProps =
  RecursicaOverStyled<MantinePaginationRootProps>;

export type PaginationEdgeProps<T extends React.ElementType> =
  React.ComponentProps<T> & {
    /** If set to true, displays text labels alongside the icon. */
    withLabel?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
>(function PaginationNext({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? NextWithLabel : undefined);
  return (
    <MantinePagination.Next
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
  PaginationEdgeProps<typeof MantinePagination.Previous>
>(function PaginationPrevious({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? PrevWithLabel : undefined);
  return (
    <MantinePagination.Previous
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
  PaginationEdgeProps<typeof MantinePagination.First>
>(function PaginationFirst({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? FirstWithLabel : undefined);
  return (
    <MantinePagination.First
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
  PaginationEdgeProps<typeof MantinePagination.Last>
>(function PaginationLast({ withLabel, icon, ...props }, ref) {
  const renderIcon = icon || (withLabel ? LastWithLabel : undefined);
  return (
    <MantinePagination.Last
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

/**
 * Recursica Pagination component wrapping Mantine's Pagination.
 */
export const Pagination = _Pagination as typeof _Pagination & {
  Root: typeof _PaginationRoot;
  Items: typeof MantinePagination.Items;
  Control: typeof MantinePagination.Control;
  Dots: typeof MantinePagination.Dots;
  Next: typeof _PaginationNext;
  Previous: typeof _PaginationPrevious;
  First: typeof _PaginationFirst;
  Last: typeof _PaginationLast;
  Icon: typeof PaginationIcon;
};

Pagination.Root = _PaginationRoot;
Pagination.Items = MantinePagination.Items;
Pagination.Control = MantinePagination.Control;
Pagination.Dots = MantinePagination.Dots;
Pagination.Next = _PaginationNext;
Pagination.Previous = _PaginationPrevious;
Pagination.First = _PaginationFirst;
Pagination.Last = _PaginationLast;
Pagination.Icon = PaginationIcon;
