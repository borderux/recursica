import { getRecursica } from "../../factory/recursica-factory.js";

/**
 * Generate button styles from recursica tokens with fallback values
 */
export const generateButtonStyles = () => {
  try {
    const recursica = getRecursica();
    const tokens = recursica.tokens;

    // Check if we have valid tokens
    if (!tokens || Object.keys(tokens).length === 0) {
      return getFallbackButtonStyles();
    }

    return getButtonStylesFromTokens(tokens);
  } catch {
    // Don't log warnings for every hover event - only log once
    if (!window.__RECURSICA_FALLBACK_WARNED__) {
      console.warn(
        "Recursica not initialized, using fallback styles. Call setRecursica() first.",
      );
      window.__RECURSICA_FALLBACK_WARNED__ = true;
    }
    return getFallbackButtonStyles();
  }
};

/**
 * Generate button styles from recursica tokens
 */
const getButtonStylesFromTokens = (tokens: Record<string, string>) => {
  return {
    button: {
      backgroundColor: tokens["color/salmon/600"] || "#e53e3e",
      color: tokens["color/gray/000"] || "#ffffff",
      border: "none",
      borderRadius: tokens["size/border-radius/default"] || "8px",
      padding: `${tokens["size/spacer/1-5x"] || "12px"} ${tokens["size/spacer/2x"] || "16px"}`,
      fontSize: tokens["font/size/md"] || "16px",
      fontWeight: tokens["font/weight/medium"] || "500",
      fontFamily: tokens["font/family/lexend"] || "system-ui, sans-serif",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      boxShadow: `0 ${tokens["elevation-y-axis/0-5x"] || "4px"} ${tokens["elevation-blur/1-5x"] || "12px"} ${tokens["elevation-spread/0-5x"] || "4px"} ${tokens["color-elevation/10"] || "rgba(0, 0, 0, 0.1)"}`,
    },
    buttonHover: {
      backgroundColor: tokens["color/salmon/700"] || "#c53030",
      boxShadow: `0 ${tokens["elevation-y-axis/1-5x"] || "8px"} ${tokens["elevation-blur/3x"] || "24px"} ${tokens["elevation-spread/1-5x"] || "8px"} ${tokens["color-elevation/14"] || "rgba(0, 0, 0, 0.15)"}`,
      transform: `translateY(-${tokens["elevation-y-axis/0-5x"] || "2px"})`,
    },
    buttonActive: {
      backgroundColor: tokens["color/salmon/800"] || "#9c2626",
      transform: "translateY(0)",
      boxShadow: `0 ${tokens["elevation-y-axis/0-5x"] || "4px"} ${tokens["elevation-blur/1-5x"] || "12px"} ${tokens["elevation-spread/0-5x"] || "4px"} ${tokens["color-elevation/10"] || "rgba(0, 0, 0, 0.1)"}`,
    },
    buttonFocus: {
      outline: "none",
      boxShadow: `0 0 0 2px ${tokens["color/salmon/300"] || "#feb2b2"}`,
    },
    buttonDisabled: {
      backgroundColor: tokens["color/gray/300"] || "#a0aec0",
      color: tokens["color/gray/500"] || "#718096",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    buttonSmall: {
      padding: `${tokens["size/spacer/0-5x"] || "8px"} ${tokens["size/spacer/1-5x"] || "12px"}`,
      fontSize: tokens["font/size/sm"] || "14px",
    },
    buttonLarge: {
      padding: `${tokens["size/spacer/2x"] || "16px"} ${tokens["size/spacer/3x"] || "24px"}`,
      fontSize: tokens["font/size/lg"] || "18px",
    },
    buttonSecondary: {
      backgroundColor: "transparent",
      color: tokens["color/salmon/600"] || "#e53e3e",
      border: `1px solid ${tokens["color/salmon/600"] || "#e53e3e"}`,
    },
    buttonSecondaryHover: {
      backgroundColor: tokens["color/salmon/50"] || "#fed7d7",
      color: tokens["color/salmon/700"] || "#c53030",
      borderColor: tokens["color/salmon/700"] || "#c53030",
    },
    buttonSecondaryActive: {
      backgroundColor: tokens["color/salmon/100"] || "#feb2b2",
      color: tokens["color/salmon/800"] || "#9c2626",
      borderColor: tokens["color/salmon/800"] || "#9c2626",
    },
  };
};

/**
 * Fallback button styles when recursica is not available
 */
const getFallbackButtonStyles = () => {
  return {
    button: {
      backgroundColor: "#e53e3e", // fallback salmon color
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "16px",
      fontWeight: "500",
      fontFamily: "system-ui, sans-serif",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    buttonHover: {
      backgroundColor: "#c53030",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-2px)",
    },
    buttonActive: {
      backgroundColor: "#9c2626",
      transform: "translateY(0)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    buttonFocus: {
      outline: "none",
      boxShadow: "0 0 0 2px #feb2b2",
    },
    buttonDisabled: {
      backgroundColor: "#a0aec0",
      color: "#718096",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    buttonSmall: {
      padding: "8px 12px",
      fontSize: "14px",
    },
    buttonLarge: {
      padding: "16px 24px",
      fontSize: "18px",
    },
    buttonSecondary: {
      backgroundColor: "transparent",
      color: "#e53e3e",
      border: "1px solid #e53e3e",
    },
    buttonSecondaryHover: {
      backgroundColor: "#fed7d7",
      color: "#c53030",
      borderColor: "#c53030",
    },
    buttonSecondaryActive: {
      backgroundColor: "#feb2b2",
      color: "#9c2626",
      borderColor: "#9c2626",
    },
  };
};

declare global {
  interface Window {
    __RECURSICA_FALLBACK_WARNED__?: boolean;
  }
}
