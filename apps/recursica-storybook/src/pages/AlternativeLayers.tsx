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

  return (
    <div className="section">
      <h2>Alternative Layers</h2>

      <div className="layers-grid">
        {alternativeLayers.map((layer) => (
          <div
            key={layer.key}
            className="layer-container"
            style={{
              backgroundColor:
                recursica.themes.RecursicaBrand[theme][
                  `layer/layer-alternative-${layer.key}/property/surface`
                ],
              color:
                recursica.themes.RecursicaBrand[theme][
                  `layer/layer-alternative-${layer.key}/property/element/text/color`
                ],
              padding:
                recursica.themes.RecursicaBrand[theme][
                  `layer/layer-alternative-${layer.key}/property/padding`
                ],
            }}
          >
            <div className="layer-content">
              <div className="layer-text-samples">
                <h3>{layer.name}</h3>
                <p
                  style={{
                    opacity:
                      recursica.themes.RecursicaBrand[theme][
                        `layer/layer-alternative-${layer.key}/property/element/text/high-emphasis`
                      ],
                  }}
                >
                  High Emphasis Text / Icon
                </p>
                <p
                  style={{
                    opacity:
                      recursica.themes.RecursicaBrand[theme][
                        `layer/layer-alternative-${layer.key}/property/element/text/low-emphasis`
                      ],
                  }}
                >
                  Low Emphasis Text / Icon
                </p>
                <p
                  style={{
                    color:
                      recursica.themes.RecursicaBrand[theme][
                        `layer/layer-alternative-${layer.key}/property/element/interactive/color`
                      ],
                    opacity:
                      recursica.themes.RecursicaBrand[theme][
                        `layer/layer-alternative-${layer.key}/property/element/text/high-emphasis`
                      ],
                  }}
                >
                  Interactive (Link / Button)
                </p>
                <p
                  style={{
                    color:
                      recursica.themes.RecursicaBrand[theme][
                        `layer/layer-alternative-${layer.key}/property/element/interactive/color`
                      ],
                    opacity:
                      recursica.themes.RecursicaBrand[theme][
                        "palette/disabled"
                      ],
                  }}
                >
                  Disabled Interactive
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
