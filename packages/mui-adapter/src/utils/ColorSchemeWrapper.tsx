import { useEffect } from "react";
import { addons } from "storybook/internal/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

const channel = addons.getChannel();

export function ColorSchemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleColorScheme = (value: boolean) => {
      const theme = value ? "dark" : "light";
      document.documentElement.setAttribute("data-recursica-theme", theme);
    };

    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, []);

  return <>{children}</>;
}
