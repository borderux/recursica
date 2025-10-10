/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRecursicaBundle } from "../src/contexts/RecursicaBundleContext";

const SizeTokens = () => {
  const { bundle } = useRecursicaBundle();
  const allTokens = Object.values(bundle.tokens);

  // Filter for size tokens
  const sizeTokens = allTokens.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (token: any) =>
      "collection" in token &&
      token.collection === "tokens" &&
      token.type === "float" &&
      token.name.startsWith("size/"),
  );

  // Group size tokens by category
  const groupedSizeTokens = sizeTokens.reduce(
    (acc: Record<string, any[]>, token: any) => {
      if (!("name" in token && "type" in token && token.type === "float")) {
        return acc;
      }
      const nameParts = token.name.split("/");
      if (nameParts.length >= 2 && nameParts[0] === "size") {
        const category = "size"; // Use "size" as the category for all size tokens
        const variant = nameParts[1]; // The variant is the second part

        if (category && variant && !acc[category]) {
          acc[category] = [];
        }

        if (category && variant && acc[category]) {
          acc[category].push({
            ...token,
            category,
            variant,
          });
        }
      }
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Sort tokens within each category by value (smallest to largest)
  Object.keys(groupedSizeTokens).forEach((category) => {
    if (groupedSizeTokens[category]) {
      groupedSizeTokens[category].sort((a, b) => {
        const aValue =
          typeof a.value === "number" ? a.value : parseFloat(String(a.value));
        const bValue =
          typeof b.value === "number" ? b.value : parseFloat(String(b.value));
        return aValue - bValue;
      });
    }
  });

  // Sort categories
  const sortedCategories = Object.keys(groupedSizeTokens).sort();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Size</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "3rem",
          marginTop: "2rem",
        }}
      >
        {sortedCategories.map((category) => (
          <div key={category}>
            <div
              style={{ textTransform: "capitalize", marginBottom: "1.5rem" }}
            >
              <h2>
                {category === "spacer"
                  ? "Spacer"
                  : category === "gutter"
                    ? "Gutter"
                    : category === "border-radius"
                      ? "Border Radius"
                      : category}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {groupedSizeTokens[category].map((token) => (
                <div
                  key={token.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width:
                        token.category === "spacer" ||
                        token.category === "gutter"
                          ? token.value
                          : 60,
                      height:
                        token.category === "spacer" ||
                        token.category === "gutter"
                          ? token.value
                          : 60,
                      backgroundColor: "#f87171",
                      borderRadius:
                        token.category === "border-radius"
                          ? token.variant === "0-5x"
                            ? "2px"
                            : token.variant === "default"
                              ? "4px"
                              : token.variant === "1-5x"
                                ? "6px"
                                : token.variant === "2x"
                                  ? "8px"
                                  : token.variant === "3x"
                                    ? "12px"
                                    : token.variant === "4x"
                                      ? "16px"
                                      : undefined
                          : undefined,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: "#111827" }}>
                      {token.value} {token.variant}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {token.name}
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
  title: "Tokens/Size",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Size tokens organized by category (Spacer, Gutter, Border Radius), showing visual representations with their values.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SizeTokensStory: Story = {
  name: "Size Tokens",
  render: () => <SizeTokens />,
  parameters: {
    controls: { disable: true }, // Disable controls to prevent serialization issues
  },
};
