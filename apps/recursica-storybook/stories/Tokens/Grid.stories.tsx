import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Flex, Typography } from "@recursica/ui-kit-mantine";
import TokenManager from "../../src/TokenManager";

const tokenManager = TokenManager.getInstance();
const gridTokens = tokenManager.getGridTokens();
const sortedBreakpoints = tokenManager.getSortedGridBreakpoints();

const GridTokens = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">Grid Tokens</Typography>
    <Box mt="size/spacer/2x">
      <Typography variant="body-1/normal" mb="size/spacer/default">
        Responsive grid system tokens defining layout patterns for different
        viewport sizes.
      </Typography>
    </Box>

    <Flex direction="column" gap="size/spacer/2x" mt="size/spacer/2x">
      {sortedBreakpoints.map((breakpoint) => {
        const token = gridTokens.find((t) => t.breakpoint === breakpoint);
        if (!token) return null;

        return (
          <Box
            key={breakpoint}
            p="size/spacer/default"
            bg="color/gray/50"
            br="size/border-radius/default"
          >
            <Flex direction="column" gap="size/spacer/0-5x">
              <Flex align="center" gap="size/spacer/0-5x">
                <Box
                  w={24}
                  h={24}
                  bg="color/salmon/500"
                  br="size/border-radius/0-5x"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="white"
                    style={{ fontSize: "10px", fontWeight: "bold" }}
                  >
                    {breakpoint.toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="h3">{breakpoint.toUpperCase()}</Typography>
                <Typography variant="body-2/normal" color="color/gray/600">
                  {token.description}
                </Typography>
              </Flex>

              <Box mt="size/spacer/0-5x">
                <Typography
                  variant="body-2/normal"
                  color="color/gray/700"
                  mb="size/spacer/0-5x"
                >
                  Layout Configuration:
                </Typography>
                {token.layouts.map((layout, index) => (
                  <Box
                    key={index}
                    p="size/spacer/0-5x"
                    bg="white"
                    br="size/border-radius/0-5x"
                    mb="size/spacer/0-5x"
                  >
                    <Flex direction="column" gap="size/spacer/0-25x">
                      <Flex justify="space-between">
                        <Typography variant="caption" color="color/gray/600">
                          Columns:
                        </Typography>
                        <Typography variant="caption" color="color/gray/900">
                          {layout.count}
                        </Typography>
                      </Flex>
                      <Flex justify="space-between">
                        <Typography variant="caption" color="color/gray/600">
                          Gap:
                        </Typography>
                        <Typography variant="caption" color="color/gray/900">
                          {layout.gap}px
                        </Typography>
                      </Flex>
                      <Flex justify="space-between">
                        <Typography variant="caption" color="color/gray/600">
                          Margin:
                        </Typography>
                        <Typography variant="caption" color="color/gray/900">
                          {layout.margin}px
                        </Typography>
                      </Flex>
                      <Flex justify="space-between">
                        <Typography variant="caption" color="color/gray/600">
                          Alignment:
                        </Typography>
                        <Typography variant="caption" color="color/gray/900">
                          {layout.alignment}
                        </Typography>
                      </Flex>
                      <Flex justify="space-between">
                        <Typography variant="caption" color="color/gray/600">
                          Pattern:
                        </Typography>
                        <Typography variant="caption" color="color/gray/900">
                          {layout.pattern}
                        </Typography>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Box>
            </Flex>
          </Box>
        );
      })}
    </Flex>
  </Box>
);

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
