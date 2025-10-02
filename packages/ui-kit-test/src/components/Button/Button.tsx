import React, { useEffect, useRef } from "react";
import { generateButtonStyles } from "./Button.styles.js";
import { applyRuntimeStyles } from "../../utils/apply-styles.js";

export interface ButtonProps {
  /**
   * The content of the button
   */
  children: React.ReactNode;

  /**
   * The size of the button
   */
  size?: "small" | "medium" | "large";

  /**
   * The variant of the button
   */
  variant?: "primary" | "secondary";

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * The type of the button
   */
  type?: "button" | "submit" | "reset";

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Additional props
   */
  [key: string]: unknown;
}

/**
 * Button component using Recursica design tokens
 * Features salmon/600 background color as requested
 * Uses runtime styles from the global recursica data
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  size = "medium",
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
  className = "",
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    try {
      const styles = generateButtonStyles();

      // Apply base button styles
      applyRuntimeStyles(buttonRef.current, styles.button);

      // Apply size-specific styles
      if (size === "small") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSmall);
      } else if (size === "large") {
        applyRuntimeStyles(buttonRef.current, styles.buttonLarge);
      }

      // Apply variant-specific styles
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondary);
      }

      // Apply disabled styles
      if (disabled) {
        applyRuntimeStyles(buttonRef.current, styles.buttonDisabled);
      }
    } catch (error) {
      console.warn("Could not apply runtime styles:", error);
    }
  }, [size, variant, disabled]);

  const handleMouseEnter = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondaryHover);
      } else {
        applyRuntimeStyles(buttonRef.current, styles.buttonHover);
      }
    } catch (error) {
      console.warn("Could not apply hover styles:", error);
    }
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondary);
      } else {
        applyRuntimeStyles(buttonRef.current, styles.button);
      }

      // Reapply size styles
      if (size === "small") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSmall);
      } else if (size === "large") {
        applyRuntimeStyles(buttonRef.current, styles.buttonLarge);
      }
    } catch (error) {
      console.warn("Could not apply leave styles:", error);
    }
  };

  const handleMouseDown = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondaryActive);
      } else {
        applyRuntimeStyles(buttonRef.current, styles.buttonActive);
      }
    } catch (error) {
      console.warn("Could not apply active styles:", error);
    }
  };

  const handleMouseUp = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondaryHover);
      } else {
        applyRuntimeStyles(buttonRef.current, styles.buttonHover);
      }
    } catch (error) {
      console.warn("Could not apply up styles:", error);
    }
  };

  const handleFocus = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      applyRuntimeStyles(buttonRef.current, styles.buttonFocus);
    } catch (error) {
      console.warn("Could not apply focus styles:", error);
    }
  };

  const handleBlur = () => {
    if (!buttonRef.current || disabled) return;

    try {
      const styles = generateButtonStyles();
      if (variant === "secondary") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSecondary);
      } else {
        applyRuntimeStyles(buttonRef.current, styles.button);
      }

      // Reapply size styles
      if (size === "small") {
        applyRuntimeStyles(buttonRef.current, styles.buttonSmall);
      } else if (size === "large") {
        applyRuntimeStyles(buttonRef.current, styles.buttonLarge);
      }
    } catch (error) {
      console.warn("Could not apply blur styles:", error);
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
