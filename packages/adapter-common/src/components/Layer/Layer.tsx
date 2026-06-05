import { forwardRef } from "react";
import styles from "./Layer.module.css";
import { RecursicaLayerProps } from "./RecursicaLayerProps";

export type LayerProps = RecursicaLayerProps &
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Applies a Recursica layer context. Root has data-recursica-layer so scoped CSS
 * theme+layer blocks (e.g. [data-recursica-theme="light"] [data-recursica-layer="1"])
 * set generic brand vars on this element; descendants inherit. Use with theme on
 * document root (RecursicaThemeProvider). Root is display: block so padding/background apply.
 */
export const Layer = forwardRef<HTMLDivElement, LayerProps>(function Layer(
  { layer, contentsOnly, children, className, style, ...rest },
  ref,
) {
  const rootClassName = contentsOnly
    ? className
      ? `${styles.root} ${styles.contents} ${className}`
      : `${styles.root} ${styles.contents}`
    : className
      ? `${styles.root} ${className}`
      : styles.root;
  return (
    <div
      ref={ref}
      className={rootClassName}
      style={style}
      {...(contentsOnly ? {} : { "data-recursica-layer": String(layer) })}
      {...rest}
    >
      {children}
    </div>
  );
});

Layer.displayName = "Layer";
