import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Flex,
  RecursicaColors,
  Typography,
} from "@recursica/ui-kit-mantine";

const colors = [
  {
    name: "Black",
    color: "colors/black",
  },
  {
    name: "White",
    color: "colors/white",
  },
  {
    name: "Alert",
    color: "colors/alert",
  },
  {
    name: "Warning",
    color: "colors/warning",
  },
  {
    name: "Success",
    color: "colors/success",
  },
  {
    name: "Disabled",
    color: "colors/black",
    opacity: 0.38,
  },
  {
    name: "Overlay",
    color: "colors/black",
    opacity: 0.38,
  },
];

const PrimaryColors = () => {
  return (
    <Box p="size/spacer/2x" bg="colors/neutral/100/tone">
      <Typography variant="h1" color="colors/neutral/050/on-tone">
        Light
      </Typography>

      {/* Primary Color Categories */}
      <Flex direction="row" gap="size/spacer/2x" h={180}>
        <Typography variant="h3" color="colors/neutral/050/on-tone">
          Colors
        </Typography>
        <Flex gap="size/spacer/2x" wrap="wrap" py={20}>
          {colors.map((color) => (
            <Flex
              key={color.name}
              direction="column"
              justify="space-between"
              align="center"
            >
              <Typography variant="h6" color="colors/neutral/050/on-tone">
                {color.name}
              </Typography>
              <Box
                w={70}
                h={70}
                bg={color.color as RecursicaColors}
                opacity={color.opacity}
              />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

const meta: Meta<typeof PrimaryColors> = {
  title: "Brand/Themes",
  component: PrimaryColors,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Primary color categories for the design system, showing Black, White, Alert, Warn, Success, Disabled, and Overlay colors.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {};
