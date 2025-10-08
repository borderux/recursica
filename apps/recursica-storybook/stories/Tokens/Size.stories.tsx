import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Typography } from "@recursica/ui-kit-mantine";
import TokenManager from "../../src/TokenManager";

const tokenManager = TokenManager.getInstance();
const sortedSizeTokens = tokenManager.getSortedSizeTokens();
const SizeTokens = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">Size</Typography>
    <table>
      {sortedSizeTokens.map((token) => (
        <tr key={token.name}>
          <td>
            <Box
              bg="color/salmon/500"
              w={token.value as number}
              h={token.value as number}
            />
          </td>
          <td>
            <Typography variant="body-1/normal">{token.name}</Typography>
          </td>
        </tr>
      ))}
    </table>
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
