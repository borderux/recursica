import React from "react";
import { Recursica } from "@recursica/official-release";

export type ColorsProps = {
  theme: string;
  recursica: Recursica;
};

export function Colors({ theme, recursica }: ColorsProps) {
  return (
    <div className="section">
      <h2>Colors</h2>
      <table className="color-swatches">
        <thead>
          <tr>
            <th>Black</th>
            <th>White</th>
            <th>Alert</th>
            <th>Warn</th>
            <th>Success</th>
            <th>
              Disabled
              <br />
              (opacity)
            </th>
            <th>
              Overlay
              <br />
              (opacity)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/black"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/white"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/alert"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/warning"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/success"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/black"],
                opacity:
                  recursica.themes.RecursicaBrand[theme]["state/disabled"],
              }}
            />
            <td
              className="swatch-box"
              style={{
                background:
                  recursica.themes.RecursicaBrand[theme]["palette/black"],
                opacity:
                  recursica.themes.RecursicaBrand[theme]["state/overlay"],
              }}
            />
          </tr>
          <tr>
            <td>
              {recursica.themes.RecursicaBrand[theme]["palette/black"]}
              <br />
              palette/black
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["palette/white"]}
              <br />
              palette/white
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["palette/alert"]}
              <br />
              palette/alert
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["palette/warning"]}
              <br />
              palette/warning
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["palette/success"]}
              <br />
              palette/success
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["state/disabled"]}
              <br />
              state/disabled
            </td>
            <td>
              {recursica.themes.RecursicaBrand[theme]["state/overlay"]}
              <br />
              state/overlay
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
