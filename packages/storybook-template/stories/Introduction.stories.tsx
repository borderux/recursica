import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

// This story is designed to be customized for each project
// Import your UI kit components here
// import { Box, Typography } from "@your-ui-kit/package";

const WelcomeComponent = () => (
  <div style={{ padding: "2rem" }}>
    <div style={{ marginBottom: "1rem" }}>
      <h1>Welcome to Your Design System</h1>
    </div>
    <div style={{ marginBottom: "1rem" }}>
      <p>
        <strong>
          This is a modern, scalable design system that bridges the gap between
          design and development through seamless Figma-to-code integration.
        </strong>
      </p>
    </div>

    <div style={{ marginBottom: "0.5rem" }}>
      <h2>What is This Design System?</h2>
    </div>
    <div style={{ marginBottom: "1rem" }}>
      <p>
        This is a comprehensive design system that enables designers and
        developers to work in perfect harmony. Through our Figma plugin, design
        tokens are automatically extracted and synchronized with your codebase,
        ensuring pixel-perfect implementation and maintaining design consistency
        across all platforms.
      </p>
    </div>

    <div style={{ marginBottom: "0.5rem" }}>
      <h2>How This Storybook Works</h2>
    </div>
    <div style={{ marginBottom: "1rem" }}>
      <p>
        This Storybook is designed to demonstrate how changes in the{" "}
        <code>recursica.json</code>
        file from our Figma plugin allow users to visually see the changes they
        made. When you update design tokens in Figma and export them through our
        plugin, those changes are immediately reflected here in the Storybook.
      </p>
    </div>

    <div style={{ marginBottom: "0.5rem" }}>
      <h2>Figma Design File Structure</h2>
    </div>
    <div style={{ marginBottom: "1rem" }}>
      <p>
        The Storybook is structured to exactly mimic the Figma design files.
        Each section and story corresponds directly to pages and components in
        your Figma file, making it easy for designers to compare Storybook
        against the Figma pages to ensure everything looks correct. This 1:1
        mapping allows for seamless design-to-development handoff and ongoing
        design system maintenance.
      </p>
    </div>

    <div style={{ marginBottom: "0.5rem" }}>
      <h2>Design Tokens</h2>
    </div>
    <div style={{ marginBottom: "1rem" }}>
      <p>
        Explore our comprehensive collection of design tokens including colors,
        sizes, typography, and more. Each token is carefully crafted to ensure
        consistency across all touchpoints and is automatically synchronized
        between Figma and your codebase.
      </p>
    </div>
  </div>
);

const meta: Meta<typeof WelcomeComponent> = {
  title: "Introduction",
  component: WelcomeComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome to your Design System - a modern, scalable design system for building exceptional user interfaces.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  name: "Welcome to Your Design System",
};
