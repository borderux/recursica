/**
 * Utility functions for applying runtime styles to DOM elements
 */

/**
 * Apply runtime styles to a DOM element
 */
export const applyRuntimeStyles = (
  element: HTMLElement,
  styles: Record<string, string | number | undefined>,
) => {
  // Filter out undefined values before applying styles
  const validStyles = Object.fromEntries(
    Object.entries(styles).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number>;

  Object.assign(element.style, validStyles);
};

/**
 * Create a CSS class dynamically at runtime
 */
export const createRuntimeCSSClass = (
  className: string,
  styles: Record<string, string | number | undefined>,
): string => {
  const styleSheet =
    document.styleSheets[0] ||
    document.head.appendChild(document.createElement("style")).sheet;
  const cssText = Object.entries(styles)
    .filter(([, value]) => value !== undefined)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");

  const rule = `.${className} { ${cssText} }`;

  try {
    styleSheet?.insertRule(rule, styleSheet.cssRules.length);
  } catch (error) {
    console.warn("Could not insert CSS rule:", rule, error);
  }

  return className;
};
