import React from "react";

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
  /** Children nodes */
  children?: React.ReactNode;
}
