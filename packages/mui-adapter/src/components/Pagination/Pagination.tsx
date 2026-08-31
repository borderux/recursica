import { forwardRef, type ComponentProps } from "react";
import {
  Pagination as MuiPagination,
  PaginationItem,
  type PaginationProps as MuiPaginationProps,
  type PaginationRenderItemParams,
} from "@mui/material";
import {
  filterStylingProps,
  mergeClassNames,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Pagination.module.css";
import {
  PaginationIcon,
  NextWithLabel,
  PrevWithLabel,
  FirstWithLabel,
  LastWithLabel,
} from "./Pagination.icons";

import { type RecursicaPaginationProps } from "@recursica/adapter-common";

export type PaginationProps = RecursicaOverStyled<
  MuiPaginationProps & RecursicaPaginationProps
>;

function usePaginationClassNames(restRecord: Record<string, unknown>): {
  className: string;
  classNames: Partial<Record<string, string>>;
} {
  const mergedClassNames = mergeClassNames(
    { root: styles.root, ul: styles.ul },
    restRecord.classNames as Partial<Record<string, string>> | undefined,
  );

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return { className: finalClass, classNames: mergedClassNames };
}

// Plain (non-labeled) icon slots — MUI's own default `NavigateBefore`/`NavigateNext`/
// `FirstPage`/`LastPage` icons never read our tokens, so every nav control is always
// replaced with our own `PaginationIcon` regardless of `withLabels`.
const iconSlots = {
  next: (p: ComponentProps<"svg">) => <PaginationIcon {...p} type="next" />,
  previous: (p: ComponentProps<"svg">) => <PaginationIcon {...p} type="prev" />,
  first: (p: ComponentProps<"svg">) => <PaginationIcon {...p} type="first" />,
  last: (p: ComponentProps<"svg">) => <PaginationIcon {...p} type="last" />,
};

const labeledIconSlots = {
  next: NextWithLabel,
  previous: PrevWithLabel,
  first: FirstWithLabel,
  last: LastWithLabel,
};

const _Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(props, ref) {
    const {
      overStyled = false,
      withLabels = false,
      total,
      withEdges,
      withControls,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const stylingParams = usePaginationClassNames(
      sanitizedProps as Record<string, unknown>,
    );

    const renderItem = (item: PaginationRenderItemParams) => {
      if (item.type === "start-ellipsis" || item.type === "end-ellipsis") {
        return <PaginationItem {...item} className={styles.dots} />;
      }
      const isNavigation = item.type !== "page";
      // `disableRipple` is a genuine `ButtonBase` prop `PaginationItemPage` forwards
      // at runtime, but MUI's own `PaginationItem` type declarations don't expose it
      // (same category of MUI type-gap other components in this adapter cast around,
      // e.g. `Card.tsx`/`Radio.tsx`'s `as unknown as MuiXProps`).
      const itemProps: Record<string, unknown> = {
        ...item,
        disableRipple: true,
        className: styles.control,
        "data-active": item.selected || undefined,
        "data-variant": isNavigation ? "text" : undefined,
        slots: withLabels ? labeledIconSlots : iconSlots,
      };
      return (
        <PaginationItem
          {...(itemProps as unknown as ComponentProps<typeof PaginationItem>)}
        />
      );
    };

    return (
      <div ref={ref} className={stylingParams.className}>
        <MuiPagination
          {...(sanitizedProps as MuiPaginationProps)}
          count={total}
          showFirstButton={withEdges}
          showLastButton={withEdges}
          hidePrevButton={withControls === false ? true : undefined}
          hideNextButton={withControls === false ? true : undefined}
          classes={stylingParams.classNames}
          renderItem={renderItem}
        />
      </div>
    );
  },
);
_Pagination.displayName = "Pagination";

/**
 * Recursica Pagination component wrapping Mui's Pagination.
 */
export const Pagination = _Pagination;
