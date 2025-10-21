/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Recursica } from "@recursica/official-release";

export interface ElevationProps {
  theme: string;
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
              backgroundColor: (recursica.themes as any)?.[
                "layer/layer-0/property/surface"
              ],
              boxShadow: `${
                (recursica.themes as any)?.[
                  `elevation/elevation-${elevation}/x-axis`
                ]
              } ${
                (recursica.themes as any)?.[
                  `elevation/elevation-${elevation}/y-axis`
                ]
              } ${
                (recursica.themes as any)?.[
                  `elevation/elevation-${elevation}/blur`
                ]
              } ${
                (recursica.themes as any)?.[
                  `elevation/elevation-${elevation}/spread`
                ]
              } ${
                (recursica.themes as any)?.[
                  `elevation/elevation-${elevation}/shadow-color`
                ]
              }`,
            }}
          >
            <span
              style={{
                color: (recursica.themes as any)?.["color/black"],
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
