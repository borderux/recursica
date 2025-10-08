import React from "react";
import "./Themes.css";
import {
  recursica,
  type RecursicaThemeRecursicaBrand,
} from "@recursica/official-release/recursica.js";
import { Colors } from "./Colors";
import { Layers } from "./Layers";

export type ThemesPageProps = {
  theme: RecursicaThemeRecursicaBrand;
};

export function ThemesPage({ theme }: ThemesPageProps) {
  return (
    <main
      style={{
        background:
          recursica.themes.RecursicaBrand[theme]["palette/neutral/100/tone"],
        color:
          recursica.themes.RecursicaBrand[theme][
            "layer/layer-0/element/text/color"
          ],
      }}
    >
      <Colors theme={theme} recursica={recursica} />
      <Layers theme={theme} recursica={recursica} />
    </main>
  );
}
