# Hello World - Welcome to Recursica! 👋

## What is Recursica?

Recursica is a powerful design system tooling ecosystem that bridges the gap between design and development. It automates the process of converting design decisions into production-ready code, ensuring perfect consistency between what designers create and what developers implement.

## The Problem We Solve

Traditionally, translating designs into code is a manual, error-prone process:
- Designers create beautiful designs in Figma
- Developers manually inspect and recreate these designs in code
- Design updates require manual code updates
- Inconsistencies creep in over time

Recursica eliminates these pain points by automating the entire design-to-code workflow.

## How It Works

### 1. Design in Figma
Designers create their design systems using Figma variables for:
- Colors and color schemes
- Typography styles
- Spacing and sizing tokens
- Border radius values
- Icons and other design assets

### 2. Export with Recursica Plugin
The Recursica Figma plugin extracts all design tokens and exports them as structured JSON data.

### 3. Generate Code Automatically
Recursica adapters transform the design tokens into:
- **Mantine Theme Files**: Complete theme configurations for the Mantine UI library
- **TypeScript Types**: Type-safe interfaces for all design tokens
- **React Components**: Ready-to-use icon components
- **CSS-in-JS Themes**: Vanilla Extract theme files with automatic theme switching

### 4. Use in Your Application
Developers import the generated code and use it directly - no manual translation needed!

## Key Features

- 🎨 **Design Token Export**: Extract colors, typography, spacing, and more from Figma
- 🔄 **Automatic Code Generation**: Convert design tokens to multiple code formats
- 🎯 **Type Safety**: Full TypeScript support for all generated code
- 🚀 **Framework Support**: Currently supports Mantine UI with more adapters coming
- 📦 **Monorepo Structure**: Well-organized packages using Turborepo
- 🛠️ **Extensible**: Easy to add new adapters for different frameworks

## Quick Start

1. Install the Recursica Figma plugin in your design file
2. Set up your design tokens as Figma variables
3. Export your tokens using the plugin
4. Run the Recursica adapter to generate code:
   ```bash
   npx @recursica/mantine-adapter
   ```
5. Import and use the generated theme in your app!

## Project Structure

```
recursica/
├── apps/
│   ├── figma-plugin/     # Figma plugin for exporting design tokens
│   ├── docs/             # Documentation site
│   └── web/              # Demo web application
├── packages/
│   ├── mantine-adapter/  # Converts tokens to Mantine themes
│   ├── schemas/          # JSON schemas and TypeScript types
│   ├── ui-kit-mantine/   # Generated UI components
│   └── common/           # Shared utilities
```

## Why "Recursica"?

The name reflects our recursive approach to design systems - where design decisions cascade through your entire codebase, maintaining consistency at every level.

## Get Involved

We welcome contributions! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) guide to get started.

---

Ready to bridge the gap between design and code? Welcome to Recursica! 🚀