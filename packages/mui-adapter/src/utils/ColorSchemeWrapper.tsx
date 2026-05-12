import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { addons } from "storybook/internal/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

const channel = addons.getChannel();

export function ColorSchemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const handleColorScheme = (value: boolean) => {
      const theme = value ? "dark" : "light";
      setColorScheme(theme);
      document.documentElement.setAttribute("data-recursica-theme", theme);
    };

    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [setColorScheme]);

  return <>{children}</>;
}
