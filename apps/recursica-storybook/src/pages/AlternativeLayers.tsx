import React from "react";
import {
  Recursica,
  RecursicaThemeRecursicaBrand,
} from "@recursica/official-release";

export interface AlternativeLayersProps {
  theme: RecursicaThemeRecursicaBrand;
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
          backgroundColor:
            recursica.themes.RecursicaBrand[theme][
              `layer/${layerKey}/property/surface`
            ],
          color:
            recursica.themes.RecursicaBrand[theme][
              `layer/${layerKey}/property/element/text/color`
            ],
          padding:
            recursica.themes.RecursicaBrand[theme][
              `layer/${layerKey}/property/padding`
            ],
        }}
      >
        <div className="layer-content">
          <div className="layer-text-samples">
            <h3
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/color`
                  ],
              }}
            >
              {layer.name}
            </h3>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/color`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/high-emphasis`
                  ],
              }}
            >
              High Emphasis Text / Icon
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/color`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/low-emphasis`
                  ],
              }}
            >
              Low Emphasis Text / Icon
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/interactive/color`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/high-emphasis`
                  ],
              }}
            >
              Interactive (Link / Button)
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/interactive/color`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme]["state/disabled"],
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
