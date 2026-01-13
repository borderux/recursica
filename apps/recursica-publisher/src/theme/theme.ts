import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "red",
  colors: {
    red: [
      "#ffe5e5",
      "#ffcccc",
      "#ff9999",
      "#ff6666",
      "#ff3333",
      "#d40d0d", // Primary red - index 5
      "#b00b0b", // Hover red - index 6
      "#8a0808",
      "#660606",
      "#330303",
    ],
    gray: [
      "#f8f9fa",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#6c757d",
      "#666", // Secondary button - index 6
      "#555", // Secondary hover - index 7
      "#495057",
      "#343a40",
    ],
    danger: [
      "#ffe5e5",
      "#ffcccc",
      "#ff9999",
      "#ff6666",
      "#ff3333",
      "#dc3545", // Danger button - index 5
      "#c82333",
      "#bd2130",
      "#b21f2d",
      "#9c1c28",
    ],
    success: [
      "#e8f5e9",
      "#c8e6c9",
      "#a5d6a7",
      "#81c784",
      "#66bb6a",
      "#4caf50", // Success button - index 5
      "#43a047",
      "#388e3c",
      "#2e7d32",
      "#1b5e20",
    ],
  },
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
  defaultRadius: "md", // 8px

  /**
   * Typography Configuration
   *
   * All font sizes use rem units for accessibility and responsiveness.
   * rem units are relative to the root element (html) font size (16px).
   * This allows users to adjust text size via browser settings.
   *
   * Conversion reference (16px base):
   * - 24px = 1.5rem (h1)
   * - 20px = 1.25rem (h2)
   * - 18px = 1.125rem (h3)
   * - 16px = 1rem (h4, body)
   * - 14px = 0.875rem (h5, md)
   * - 12px = 0.75rem (h6, sm)
   * - 10px = 0.625rem (xs)
   */
  headings: {
    sizes: {
      h1: { fontSize: "1.5rem", lineHeight: "1.3", fontWeight: "700" }, // 24px
      h2: { fontSize: "1.25rem", lineHeight: "1.3", fontWeight: "600" }, // 20px
      h3: { fontSize: "1.125rem", lineHeight: "1.3", fontWeight: "600" }, // 18px
      h4: { fontSize: "1rem", lineHeight: "1.4", fontWeight: "500" }, // 16px
      h5: { fontSize: "0.875rem", lineHeight: "1.4", fontWeight: "500" }, // 14px
      h6: { fontSize: "0.75rem", lineHeight: "1.4", fontWeight: "500" }, // 12px
    },
  },
  fontSizes: {
    xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    md: "0.875rem", // 14px
    lg: "1rem", // 16px
    xl: "1.125rem", // 18px
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  components: {
    // Commented out style overrides - add back only as necessary
    // Button: {
    //   defaultProps: {
    //     radius: "md", // Not needed - defaultRadius is already "md"
    //   },
    //   styles: {
    //     root: {
    //       fontWeight: "bold", // Removed - not necessary
    //     },
    //   },
    // },
    // Text: {
    //   styles: {
    //     root: {
    //       fontSize: "16px", // Mantine has default font sizes
    //       color: "#333", // Mantine has default colors
    //     },
    //   },
    // },
    // Title: {
    //   styles: {
    //     root: {
    //       fontWeight: "bold", // Mantine titles are bold by default
    //       color: "#333", // Mantine has default colors
    //     },
    //   },
    // },
    // TextInput: {
    //   defaultProps: {
    //     radius: "md", // Not needed - defaultRadius is already "md"
    //   },
    //   styles: {
    //     input: {
    //       border: "1px solid #d1d9e0", // Mantine has default borders
    //       padding: "12px 16px", // Mantine has default padding
    //       "&:focus": {
    //         borderColor: "var(--mantine-color-red-5)", // Can add back if needed
    //         borderWidth: "2px",
    //       },
    //     },
    //   },
    // },
    // Textarea: {
    //   defaultProps: {
    //     radius: "md", // Not needed - defaultRadius is already "md"
    //   },
    //   styles: {
    //     input: {
    //       border: "1px solid #d1d9e0", // Mantine has default borders
    //       padding: "12px 16px", // Mantine has default padding
    //       "&:focus": {
    //         borderColor: "var(--mantine-color-red-5)", // Can add back if needed
    //         borderWidth: "2px",
    //       },
    //     },
    //   },
    // },
    // Select: {
    //   defaultProps: {
    //     radius: "md", // Not needed - defaultRadius is already "md"
    //   },
    //   styles: {
    //     input: {
    //       border: "1px solid #d1d9e0", // Mantine has default borders
    //       padding: "12px 16px", // Mantine has default padding
    //     },
    //     dropdown: {
    //       border: "1px solid #d1d9e0", // Mantine has default styling
    //       borderRadius: "var(--mantine-radius-md)", // Mantine has default radius
    //       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Mantine has default shadows
    //       maxHeight: "250px", // Can add back if needed
    //       overflowY: "auto",
    //     },
    //     option: {
    //       padding: "12px 16px", // Mantine has default padding
    //       borderBottom: "1px solid #f1f3f4", // Can add back if needed
    //       "&:hover": {
    //         backgroundColor: "#f6f8fa", // Mantine has default hover states
    //       },
    //     },
    //   },
    // },
    // Card: {
    //   defaultProps: {
    //     radius: "md", // Not needed - defaultRadius is already "md"
    //     padding: "md", // Mantine has default padding
    //   },
    // },
  },
});
