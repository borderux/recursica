import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Flex, Typography } from "@recursica/ui-kit-mantine";
import TokenManager from "../../src/TokenManager";

const tokenManager = TokenManager.getInstance();
const groupedSizeTokens = tokenManager.getGroupedSizeTokens();
const sortedCategories = tokenManager.getSortedSizeCategories();

const SizeTokens = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">Size</Typography>
    <Flex direction="row" gap="size/spacer/3x" style={{ marginTop: "2rem" }}>
      {sortedCategories.map((category) => (
        <Box key={category}>
          <Box style={{ textTransform: "capitalize", marginBottom: "1.5rem" }}>
            <Typography variant="h2">
              {category === "spacer"
                ? "Spacer"
                : category === "gutter"
                  ? "Gutter"
                  : category === "border-radius"
                    ? "Border Radius"
                    : category}
            </Typography>
          </Box>
          <Flex direction="column" gap="size/spacer/default">
            {groupedSizeTokens[category].map((token) => (
              <Flex key={token.name} align="center" gap="size/spacer/default">
                <Box
                  w={
                    token.category === "spacer" || token.category === "gutter"
                      ? token.value
                      : 60
                  }
                  h={
                    token.category === "spacer" || token.category === "gutter"
                      ? token.value
                      : 60
                  }
                  bg="color/salmon/500"
                  br={
                    token.category === "border-radius"
                      ? token.variant === "0-5x"
                        ? "size/border-radius/0-5x"
                        : token.variant === "default"
                          ? "size/border-radius/default"
                          : token.variant === "1-5x"
                            ? "size/border-radius/1-5x"
                            : token.variant === "2x"
                              ? "size/border-radius/2x"
                              : token.variant === "3x"
                                ? "size/border-radius/3x"
                                : token.variant === "4x"
                                  ? "size/border-radius/4x"
                                  : undefined
                      : undefined
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <Flex direction="column" align="flex-start">
                  <Typography variant="body-1/normal" color="color/gray/900">
                    {token.value} {token.variant}
                  </Typography>
                  <Typography variant="caption" color="color/gray/600">
                    {token.name}
                  </Typography>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Box>
      ))}
    </Flex>
  </Box>
);

const meta: Meta<typeof SizeTokens> = {
  title: "Tokens/Size",
  component: SizeTokens,
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
type Story = StoryObj<typeof meta>;

export const SizeTokensStory: Story = {
  name: "Size Tokens",
};
