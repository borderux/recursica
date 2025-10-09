import React from "react";
import { Recursica } from "@recursica/official-release";

export interface LayersProps {
  theme: string;
  recursica: Recursica;
}
export function Layers({ theme, recursica }: LayersProps) {
  const layers = [
    { number: 0, name: "Layer 0 (Background)", hasBorder: false },
    { number: 1, name: "Layer 1", hasBorder: true },
    { number: 2, name: "Layer 2", hasBorder: true },
    { number: 3, name: "Layer 3", hasBorder: true },
  ];

  const renderLayer = (layer: (typeof layers)[0], depth: number = 0) => {
    const layerKey = `layer-${layer.number}`;
    const hasNestedLayers = layer.number < 3;

    return (
      <div
        key={layer.number}
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
          ...(layer.hasBorder && {
            borderWidth:
              recursica.themes.RecursicaBrand[theme][
                `layer/${layerKey}/property/border-thickness`
              ],
            borderStyle: "solid",
            borderColor:
              recursica.themes.RecursicaBrand[theme][
                `layer/${layerKey}/property/border-color`
              ],
          }),
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
                    `layer/${layerKey}/element/interactive/high-emphasis`
                  ],
              }}
            >
              Interactive (Link / Button)
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/interactive/hover-color`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/interactive/hover`
                  ],
              }}
            >
              Interactive (Hover)
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
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/alert`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/high-emphasis`
                  ],
              }}
            >
              Alert
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/warning`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/high-emphasis`
                  ],
              }}
            >
              Warning
            </p>
            <p
              style={{
                color:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/success`
                  ],
                opacity:
                  recursica.themes.RecursicaBrand[theme][
                    `layer/${layerKey}/element/text/high-emphasis`
                  ],
              }}
            >
              Success
            </p>
          </div>

          {hasNestedLayers && (
            <div className="nested-layers">
              {renderLayer(layers[layer.number + 1], depth + 1)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <h2>Layers</h2>
      {renderLayer(layers[0])}
    </div>
  );
}
