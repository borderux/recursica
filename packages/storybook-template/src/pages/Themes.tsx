import React from "react";
import { Colors } from "./Colors";
import { Layers } from "./Layers";
import { AlternativeLayers } from "./AlternativeLayers";
import { Elevation } from "./Elevation";
import { Scales } from "./Scales";
import { useRecursicaBundle } from "@recursica/storybook-template";
import "./Themes.css";

export type ThemesPageProps = {
  theme: string;
};

export function ThemesPage({ theme }: ThemesPageProps) {
  const { bundle } = useRecursicaBundle();
  return (
    <main
      style={{
        background:
          bundle?.themes?.RecursicaBrand?.[theme]?.["palette/neutral/100/tone"],
        color:
          bundle?.themes?.RecursicaBrand?.[theme]?.[
            "layer/layer-0/element/text/color"
          ],
      }}
    >
      <Colors theme={theme} recursica={bundle} />
      <Scales theme={theme} recursica={bundle} />
      <Layers theme={theme} recursica={bundle} />
      <AlternativeLayers theme={theme} recursica={bundle} />
      <Elevation theme={theme} recursica={bundle} />
    </main>
  );
}
