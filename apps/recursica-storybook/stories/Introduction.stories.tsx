import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Typography } from "@recursica/ui-kit-mantine";

const WelcomeComponent = () => (
  <Box p="size/spacer/2x">
    <Box mb="size/spacer/default">
      <Typography variant="h1">Welcome to Recursica Design System</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        <strong>
          The modern, scalable design system that bridges the gap between design
          and development.
        </strong>
      </Typography>
    </Box>

    <Box mb="size/spacer/0-5x">
      <Typography variant="h2">Design Tokens</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        Explore our comprehensive collection of design tokens including colors,
        sizes, typography, and more. Each token is carefully crafted to ensure
        consistency across all touchpoints.
      </Typography>
    </Box>
  </Box>
);

const meta: Meta<typeof WelcomeComponent> = {
  title: "Introduction/Welcome",
  component: WelcomeComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome to the Recursica Design System - a modern, scalable design system for building exceptional user interfaces.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  name: "Welcome to Recursica",
};
