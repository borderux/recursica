import { forwardRef } from "react";
import styles from "./Layer.module.css";

/**
 * Recursica design-system props for Layer.
 * Sets data-recursica-layer so scoped CSS theme+layer blocks apply that layer's
 * generic brand vars (e.g. --recursica_brand_layer_N_properties_surface) to this element
 * and descendants. Theme is set on the document root (e.g. via RecursicaThemeProvider).
 * See recursica_variables_scoped.css header.
 */
export interface RecursicaLayerProps {
  /** Layer (0–3). Sets data-recursica-layer on the root so descendants use this layer's styles. */
  layer: 0 | 1 | 2 | 3;
  /**
   * When true, the root uses display: contents (no box, not styled) and data-recursica-layer
   * is omitted so Recursica layer styling is not applied. Children still participate in the cascade.
   */
  contentsOnly?: boolean;
  children?: React.ReactNode;
}

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
