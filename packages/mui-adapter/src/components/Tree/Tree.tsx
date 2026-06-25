import React, { forwardRef } from "react";
import { type RecursicaOverStyled } from "../../utils/filterStylingProps";
import styles from "./Tree.module.css";

export interface TreeProps extends React.ComponentPropsWithoutRef<"div"> {
  overStyled?: boolean;
}

/**
 * Placeholder component for Tree (Coming Soon).
 */
export const Tree = forwardRef<HTMLDivElement, RecursicaOverStyled<TreeProps>>(
  function Tree({ overStyled = false, className, ...rest }, ref) {
    const finalClass = className ? `${styles.root} ${className}` : styles.root;
    return (
      <div ref={ref} className={finalClass} {...rest}>
        Tree (Coming Soon)
      </div>
    );
  },
);

Tree.displayName = "Tree";
