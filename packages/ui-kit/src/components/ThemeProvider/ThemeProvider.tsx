import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "../../recursica/RecursicaRecursicaMantineTheme";
import { useEffect } from "react";
interface ThemeProviderProps {
  themeClassname: string;
  children: React.ReactNode;
}

export function ThemeProvider({
  children,
  themeClassname,
}: ThemeProviderProps) {
  useEffect(() => {
    // insert the themeClassname value to the root element
    const root = document.documentElement;
    root.classList.add(themeClassname);
    // remove the themeClassname value from the root element
    return () => {
      root.classList.remove(themeClassname);
    };
  }, [themeClassname]);

  return <MantineProvider theme={mantineTheme}>{children}</MantineProvider>;
}
