import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Flex,
  Typography,
  type RecursicaColors,
} from "@recursica/ui-kit-mantine";
import TokenManager from "../../src/TokenManager";

const tokenManager = TokenManager.getInstance();
const groupedColors = tokenManager.getGroupedColors();
const sortedFamilies = tokenManager.getSortedColorFamilies();

const ColorPalette = () => (
  <Box p="size/spacer/2x">
    <Typography variant="h1">Color Palette</Typography>
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sortedFamilies.length}, 1fr)`,
        gap: "2rem",
        marginTop: "2rem",
      }}
    >
      {sortedFamilies.map((familyName) => (
        <Flex key={familyName} direction="column">
          <Box style={{ textTransform: "capitalize", marginBottom: "1rem" }}>
            <Typography variant="h3">{familyName}</Typography>
          </Box>
          <Flex direction="column" gap="size/spacer/0-5x">
            {groupedColors[familyName].map((color) => (
              <Flex key={color.name} align="center" gap="size/spacer/0-5x">
                <Box
                  w={40}
                  h={40}
                  bg={color.name as RecursicaColors}
                  br="size/border-radius/0-5x"
                  bw="1px"
                  bc="color/gray/200"
                />
                <Box>
                  <Typography variant="body-2/normal" color="color/gray/900">
                    {color.family}-{color.shade}
                  </Typography>
                  <Typography variant="caption" color="color/gray/600">
                    {color.value.toString()}
                  </Typography>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ))}
    </Box>
  </Box>
);

const meta: Meta<typeof ColorPalette> = {
  title: "Tokens/Colors",
  component: ColorPalette,
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
type Story = StoryObj<typeof meta>;

export const ColorPaletteStory: Story = {
  name: "Color Palette",
};
