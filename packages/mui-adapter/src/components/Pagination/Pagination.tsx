import { forwardRef } from "react";
import {
  Pagination as MuiPagination,
  type PaginationProps as MuiPaginationProps,
} from "@mui/material";
import {
  filterStylingProps,
  type RecursicaOverStyled,
} from "../../utils/filterStylingProps";
import styles from "./Pagination.module.css";

import { type RecursicaPaginationProps } from "@recursica/adapter-common";

export type PaginationProps = RecursicaOverStyled<
  MuiPaginationProps & RecursicaPaginationProps
>;

function usePaginationClassNames(restRecord: Record<string, unknown>): {
  className: string;
  classNames: Partial<Record<string, string>>;
} {
  const mergedClassNames: Partial<Record<string, string>> = {
    root: styles.root,
    ul: styles.ul,
  };

  const classNamesProp = restRecord.classNames;
  if (
    classNamesProp &&
    typeof classNamesProp === "object" &&
    !Array.isArray(classNamesProp)
  ) {
    const o = classNamesProp as Partial<Record<string, string>>;
    mergedClassNames.root = o.root ? `${styles.root} ${o.root}` : styles.root;
    mergedClassNames.ul = o.ul ? `${styles.ul} ${o.ul}` : styles.ul;
  }

  const classNameProp = restRecord.className as string | undefined;
  const finalClass = classNameProp
    ? `${styles.root} ${classNameProp}`
    : styles.root;

  return { className: finalClass, classNames: mergedClassNames };
}

const _Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(props, ref) {
    const {
      overStyled = false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      withLabels,
      total,
      withEdges,
      withControls,
      ...rest
    } = props;

    const sanitizedProps = filterStylingProps(rest, overStyled);
    const stylingParams = usePaginationClassNames(
      sanitizedProps as Record<string, unknown>,
    );

    return (
      <div ref={ref} className={stylingParams.className}>
        <MuiPagination
          count={total}
          showFirstButton={withEdges}
          showLastButton={withEdges}
          hidePrevButton={withControls === false ? true : undefined}
          hideNextButton={withControls === false ? true : undefined}
          classes={stylingParams.classNames}
          {...(sanitizedProps as MuiPaginationProps)}
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
