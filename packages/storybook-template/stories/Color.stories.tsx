/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaBundle } from "@recursica/storybook-template"; // Its import to import from the package so that the context module resolution works

const ColorPalette = () => {
  const { bundle } = useRecursicaBundle();
  const allTokens = Object.values(bundle.tokens);

  // Filter for color tokens
  const colors = allTokens.filter(
    (token: any) =>
      "collection" in token &&
      token.collection === "tokens" &&
      token.type === "color" &&
      token.name.startsWith("color/") &&
      !token.name.startsWith("color/elevation/"),
  );

  // Group colors by family (from TokenManager logic)
  const groupedColors = colors.reduce(
    (acc: Record<string, any[]>, token: any) => {
      if (!("collection" in token)) {
        return acc;
      }
      const nameParts = token.name.split("/");
      if (nameParts.length >= 3 && nameParts[0] === "color") {
        const family = nameParts[1];
        const shadeStr = nameParts[2];

        if (family && shadeStr && !acc[family]) {
          acc[family] = [];
        }

        if (family && shadeStr && acc[family]) {
          acc[family].push({
            ...token,
            family,
            shade: parseInt(shadeStr),
          });
        }
      }
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Sort shades within each family (darkest to lightest)
  Object.keys(groupedColors).forEach((family) => {
    if (groupedColors[family]) {
      groupedColors[family].sort((a, b) => b.shade - a.shade);
    }
  });

  // Sort families
  const sortedFamilies = Object.keys(groupedColors).sort();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Color Palette</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${sortedFamilies.length}, 1fr)`,
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {sortedFamilies.map((familyName) => (
          <div
            key={familyName}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ textTransform: "capitalize", marginBottom: "1rem" }}>
              <h3>{familyName}</h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {groupedColors[familyName].map((color) => (
                <div
                  key={color.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: color.value.toString(),
                      borderRadius: "4px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", color: "#111827" }}>
                      {color.family}-{color.shade}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {color.value.toString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Color palette organized by color families, showing all available color tokens with their hex values.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColorPaletteStory: Story = {
  name: "Color Palette",
  render: () => <ColorPalette />,
  parameters: {
    controls: { disable: true }, // Disable controls to prevent serialization issues
  },
};
