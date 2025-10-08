import React from "react";
import {
  RecursicaThemeRecursicaBrand,
  Recursica,
} from "@recursica/official-release/recursica.d";

export type ScalesProps = {
  theme: RecursicaThemeRecursicaBrand;
  recursica: Recursica;
};

export function Scales({ theme, recursica }: ScalesProps) {
  const scales = [
    {
      name: "Neutral (Grayscale)",
      key: "neutral",
      defaultScale: "200",
    },
    {
      name: "Palette 1 (Primary)",
      key: "palette-1",
      defaultScale: "400",
    },
    {
      name: "Palette 2 (Secondary)",
      key: "palette-2",
      defaultScale: "400",
    },
  ];

  const scaleValues = [
    "900",
    "800",
    "700",
    "600",
    "500",
    "400",
    "300",
    "200",
    "100",
    "050",
  ];
  const emphasisTypes = [
    { name: "High", key: "high-emphasis", className: "high-emphasis" },
    { name: "Low", key: "low-emphasis", className: "low-emphasis" },
  ];

  const renderScaleTable = (scale: (typeof scales)[0]) => {
    return (
      <div key={scale.key} className="palette-container">
        <h3>{scale.name}</h3>
        <table className="color-palettes">
          <thead>
            <tr>
              <th>Emphasis</th>
              {scaleValues.map((value) => (
                <th
                  key={value}
                  className={value === scale.defaultScale ? "default" : ""}
                >
                  {value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emphasisTypes.map((emphasis) => (
              <tr key={emphasis.key} className={emphasis.className}>
                <td>{emphasis.name}</td>
                {scaleValues.map((value) => (
                  <td
                    key={`${emphasis.key}-${value}`}
                    className={`palette-box ${value === scale.defaultScale ? "default" : ""}`}
                    style={{
                      backgroundColor:
                        recursica.themes.RecursicaBrand[theme][
                          `palette/${scale.key}/${value}/tone`
                        ],
                    }}
                  >
                    <div
                      className="palette-dot"
                      style={{
                        backgroundColor:
                          recursica.themes.RecursicaBrand[theme][
                            `palette/${scale.key}/${value}/on-tone`
                          ],
                        opacity:
                          recursica.themes.RecursicaBrand[theme][
                            `palette/${scale.key}/${value}/${emphasis.key}`
                          ],
                      }}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td>Tone</td>
              {scaleValues.map((value) => (
                <td
                  key={`tone-${value}`}
                  className={value === scale.defaultScale ? "default" : ""}
                >
                  {
                    recursica.themes.RecursicaBrand[theme][
                      `palette/${scale.key}/${value}/tone`
                    ]
                  }
                  <br />
                  palette/{scale.key}/{value}/tone
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="section">
      {scales.map((scale) => renderScaleTable(scale))}
    </div>
  );
}
