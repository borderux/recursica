import React from "react";
import {
  Recursica,
  RecursicaThemeRecursicaBrand,
} from "@recursica/official-release";

export interface ElevationProps {
  theme: RecursicaThemeRecursicaBrand;
  recursica: Recursica;
}

export function Elevation({ theme, recursica }: ElevationProps) {
  const elevations = [0, 1, 2, 3, 4];

  return (
    <div className="section">
      <h2>Elevation</h2>
      <div className="elevation-grid">
        {elevations.map((elevation) => (
          <div
            key={elevation}
            className="card text-center elevation-card"
            style={{
              backgroundColor:
                recursica.themes.RecursicaBrand[theme][
                  "layer/layer-0/property/surface"
                ],
              boxShadow: `${
                recursica.themes.RecursicaBrand[theme][
                  `elevation/elevation-${elevation}/x-axis`
                ]
              } ${
                recursica.themes.RecursicaBrand[theme][
                  `elevation/elevation-${elevation}/y-axis`
                ]
              } ${
                recursica.themes.RecursicaBrand[theme][
                  `elevation/elevation-${elevation}/blur`
                ]
              } ${
                recursica.themes.RecursicaBrand[theme][
                  `elevation/elevation-${elevation}/spread`
                ]
              } ${
                recursica.themes.RecursicaBrand[theme][
                  `elevation/elevation-${elevation}/shadow-color`
                ]
              }`,
            }}
          >
            <span
              style={{
                color: recursica.themes.RecursicaBrand[theme]["color/black"],
              }}
            >
              {elevation}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
