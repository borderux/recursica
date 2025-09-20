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
          Recursica is a modern, scalable design system that bridges the gap
          between design and development through seamless Figma-to-code
          integration.
        </strong>
      </Typography>
    </Box>

    <Box mb="size/spacer/0-5x">
      <Typography variant="h2">What is Recursica?</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        Recursica is a comprehensive design system that enables designers and
        developers to work in perfect harmony. Through our Figma plugin, design
        tokens are automatically extracted and synchronized with your codebase,
        ensuring pixel-perfect implementation and maintaining design consistency
        across all platforms.
      </Typography>
    </Box>

    <Box mb="size/spacer/0-5x">
      <Typography variant="h2">How This Storybook Works</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        This Storybook is designed to demonstrate how changes in the{" "}
        <code>recursica.json</code>
        file from our Figma plugin allow users to visually see the changes they
        made. When you update design tokens in Figma and export them through our
        plugin, those changes are immediately reflected here in the Storybook.
      </Typography>
    </Box>

    <Box mb="size/spacer/0-5x">
      <Typography variant="h2">Figma Design File Structure</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        The Storybook is structured to exactly mimic the Figma design files.
        Each section and story corresponds directly to pages and components in
        your Figma file, making it easy for designers to compare Storybook
        against the Figma pages to ensure everything looks correct. This 1:1
        mapping allows for seamless design-to-development handoff and ongoing
        design system maintenance.
      </Typography>
    </Box>

    <Box mb="size/spacer/0-5x">
      <Typography variant="h2">Design Tokens</Typography>
    </Box>
    <Box mb="size/spacer/default">
      <Typography variant="body-1/normal">
        Explore our comprehensive collection of design tokens including colors,
        sizes, typography, and more. Each token is carefully crafted to ensure
        consistency across all touchpoints and is automatically synchronized
        between Figma and your codebase.
      </Typography>
    </Box>
  </Box>
);

const meta: Meta<typeof WelcomeComponent> = {
  title: "Introduction",
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
