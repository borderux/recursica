import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Flex, Typography } from "@recursica/ui-kit-mantine";
import TokenManager from "../../src/TokenManager";

const tokenManager = TokenManager.getInstance();
const sortedBreakpoints = tokenManager.getSortedGridBreakpoints();

const GridTokens = () => {
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
    <Box p="size/spacer/2x" bg="color/gray/100">
      <Box mb="size/spacer/2x">
        <Typography variant="h2">Grid Tokens</Typography>
      </Box>

      <Flex direction="column" gap="size/spacer/3x">
        <Flex gap="size/spacer/2x" wrap="wrap">
          {sortedBreakpoints.map((gridToken) => {
            if (!gridToken) return null;
            const width = getBreakpointWidth(gridToken.name);

            return (
              <Box key={gridToken.name} style={{ width: `${width}px` }}>
                <Box mb="size/spacer/0-5x">
                  <Typography variant="body-2/normal" color="color/gray/800">
                    {gridToken.name.toUpperCase()} = {width}px
                  </Typography>
                </Box>
                <Box h={400} bg="color/gray/050" style={{ overflow: "hidden" }}>
                  {gridToken.layouts.map((layout, layoutIndex) => (
                    <Flex
                      key={layoutIndex}
                      h="100%"
                      gap={layout.gap}
                      style={{
                        alignItems:
                          layout.alignment.toLowerCase() === "stretch"
                            ? "stretch"
                            : "center",
                        justifyContent:
                          layout.alignment.toLowerCase() === "center"
                            ? "center"
                            : "flex-start",
                      }}
                    >
                      {Array.from({ length: layout.count }, (_, index) => (
                        <Box
                          key={index}
                          h="100%"
                          bg="color/salmon/50"
                          style={{
                            flex:
                              layout.alignment.toLowerCase() === "stretch"
                                ? 1
                                : "none",
                            width: layout.width ? `${layout.width}px` : "auto",
                          }}
                        />
                      ))}
                    </Flex>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

const meta: Meta<typeof GridTokens> = {
  title: "Tokens/Grid",
  component: GridTokens,
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
type Story = StoryObj<typeof meta>;

export const GridTokensStory: Story = {
  name: "Grid Tokens",
};
