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
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: "bold",
        },
      },
    },
    Text: {
      styles: {
        root: {
          fontSize: "16px",
          color: "#333",
        },
      },
    },
    Title: {
      styles: {
        root: {
          fontWeight: "bold",
          color: "#333",
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          border: "1px solid #d1d9e0",
          padding: "12px 16px",
          "&:focus": {
            borderColor: "var(--mantine-color-red-5)",
            borderWidth: "2px",
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          border: "1px solid #d1d9e0",
          padding: "12px 16px",
          "&:focus": {
            borderColor: "var(--mantine-color-red-5)",
            borderWidth: "2px",
          },
        },
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        input: {
          border: "1px solid #d1d9e0",
          padding: "12px 16px",
        },
        dropdown: {
          border: "1px solid #d1d9e0",
          borderRadius: "var(--mantine-radius-md)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          maxHeight: "250px",
          overflowY: "auto",
        },
        option: {
          padding: "12px 16px",
          borderBottom: "1px solid #f1f3f4",
          "&:hover": {
            backgroundColor: "#f6f8fa",
          },
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        padding: "md",
      },
    },
  },
});
