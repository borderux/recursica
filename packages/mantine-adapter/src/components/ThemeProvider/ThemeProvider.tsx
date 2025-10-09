import { useEffect } from "react";

interface ThemeProviderProps {
  currentTheme?: string;
  children: React.ReactNode;
}

const THEME_DATA_ATTRIBUTE = "data-current-theme";

export function ThemeProvider({ children, currentTheme }: ThemeProviderProps) {
  useEffect(() => {
    if (!currentTheme) return;

    const root = document.documentElement;

    // Get the previously applied theme class from data attribute
    const previousTheme = root.getAttribute(THEME_DATA_ATTRIBUTE);

    // Remove the previous theme class if it exists
    if (previousTheme) {
      root.classList.remove(previousTheme);
    }

    // Apply the new theme class
    root.classList.add(currentTheme);

    // Store the current theme class in the data attribute
    root.setAttribute(THEME_DATA_ATTRIBUTE, currentTheme);

    // Cleanup: remove current theme class and data attribute when component unmounts
    return () => {
      root.classList.remove(currentTheme);
      root.removeAttribute(THEME_DATA_ATTRIBUTE);
    };
  }, [currentTheme]);

  return <>{children}</>;
}
