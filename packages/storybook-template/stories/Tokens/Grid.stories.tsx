import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaBundle } from "@recursica/storybook-template";

const GridTokens = () => {
  const { bundle } = useRecursicaBundle();
  const allTokens = Object.values(bundle.tokens);

  // Filter for grid tokens (from TokenManager logic)
  const gridTokens = allTokens.filter(
    (token: any) => "type" in token && token.type === "GRID",
  );

  // Process grid tokens (from TokenManager logic)
  const processedGridTokens = gridTokens
    .filter(
      (token: any): token is any => "type" in token && token.type === "GRID",
    )
    .map((token: any) => {
      return {
        type: token.type,
        name: token.name,
        description: token.description,
        layouts: token.layouts || [],
      };
    });

  // Sort by breakpoint size order: xs, sm, md, lg (from TokenManager logic)
  const sortedBreakpoints = processedGridTokens.sort((a: any, b: any) => {
    const order: Record<string, number> = { xs: 0, sm: 1, md: 2, lg: 3 };
    const aOrder = order[a.name] ?? 999;
    const bOrder = order[b.name] ?? 999;
    return aOrder - bOrder;
  });

  const getBreakpointWidth = (name: string) => {
    switch (name) {
      case "xs":
        return 320;
      case "sm":
        return 768;
      case "md":
        return 1200;
      case "lg":
        return 1400;
      default:
        return 1200;
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f3f4f6" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Grid Tokens</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {sortedBreakpoints.map((gridToken) => {
            if (!gridToken) return null;
            const width = getBreakpointWidth(gridToken.name);

            return (
              <div key={gridToken.name} style={{ width: `${width}px` }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <div style={{ fontSize: "14px", color: "#1f2937" }}>
                    {gridToken.name.toUpperCase()} = {width}px
                  </div>
                </div>
                <div
                  style={{
                    height: "400px",
                    backgroundColor: "#f9fafb",
                    overflow: "hidden",
                  }}
                >
                  {gridToken.layouts.map((layout, layoutIndex) => (
                    <div
                      key={layoutIndex}
                      style={{
                        height: "100%",
                        display: "flex",
                        gap: layout.gap,
                        alignItems:
                          layout.alignment === "stretch" ? "stretch" : "center",
                        justifyContent:
                          layout.alignment === "center"
                            ? "center"
                            : "flex-start",
                      }}
                    >
                      {Array.from({ length: layout.count }, (_, index) => (
                        <div
                          key={index}
                          style={{
                            height: "100%",
                            backgroundColor: "#fecaca",
                            flex: layout.alignment === "stretch" ? 1 : "none",
                            width: layout.width ? `${layout.width}px` : "auto",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: "Tokens/Grid",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Grid tokens defining responsive layout patterns for different viewport sizes, including column counts, gaps, margins, and alignment settings.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GridTokensStory: Story = {
  name: "Grid Tokens",
  render: () => <GridTokens />,
  parameters: {
    controls: { disable: true }, // Disable controls to prevent serialization issues
  },
};
