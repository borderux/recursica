/**
 * Props for the Recursica AssistiveElement component.
 */
export interface RecursicaAssistiveElementProps {
  /** The semantic variant driving the icon and text colors */
  assistiveVariant?: "help" | "error";
  /** Explicitly toggle the rendering of the variant-specific SVG icon */
  assistiveWithIcon?: boolean;
}
