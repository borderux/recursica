/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Recursica } from "@recursica/official-release";

export interface AlternativeLayersProps {
  theme: string;
  recursica: Recursica;
}

export function AlternativeLayers({
  theme,
  recursica,
}: AlternativeLayersProps) {
  const alternativeLayers = [
    {
      name: "High Contrast",
      key: "high-contrast",
    },
    {
      name: "Primary Color",
      key: "primary-color",
    },
    {
      name: "Alert",
      key: "alert",
    },
    {
      name: "Warning",
      key: "warning",
    },
    {
      name: "Success",
      key: "success",
    },
  ];

  const renderAlternativeLayer = (layer: (typeof alternativeLayers)[0]) => {
    const layerKey = `layer-alternative/${layer.key}`;

    return (
      <div
        key={layer.key}
        className="layer-container"
        style={{
          backgroundColor: (recursica.themes as any)?.[
            `layer/${layerKey}/property/surface`
          ],
          color: (recursica.themes as any)?.[
            `layer/${layerKey}/property/element/text/color`
          ],
          padding: (recursica.themes as any)?.[
            `layer/${layerKey}/property/padding`
          ],
        }}
      >
        <div className="layer-content">
          <div className="layer-text-samples">
            <h3
              style={{
                color: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/color`
                ],
              }}
            >
              {layer.name}
            </h3>
            <p
              style={{
                color: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/color`
                ],
                opacity: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/high-emphasis`
                ],
              }}
            >
              High Emphasis Text / Icon
            </p>
            <p
              style={{
                color: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/color`
                ],
                opacity: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/low-emphasis`
                ],
              }}
            >
              Low Emphasis Text / Icon
            </p>
            <p
              style={{
                color: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/interactive/color`
                ],
                opacity: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/text/high-emphasis`
                ],
              }}
            >
              Interactive (Link / Button)
            </p>
            <p
              style={{
                color: (recursica.themes as any)?.[
                  `layer/${layerKey}/element/interactive/color`
                ],
                opacity: (recursica.themes as any)?.["state/disabled"],
              }}
            >
              Disabled Interactive
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <h2>Alternative Layers</h2>

      <div className="layers-grid">
        {alternativeLayers.map((layer) => renderAlternativeLayer(layer))}
      </div>
    </div>
  );
}
