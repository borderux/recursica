# Recursica

Recursica is a comprehensive design system and component library that helps teams build consistent, beautiful user interfaces. It provides a set of reusable components, design tokens, and tools for seamless integration with Figma and various frontend frameworks.

## Documentation

Get started with Recursica using our comprehensive guides:

- **[Introduction](docs/INTRODUCTION.md)** - Learn about Recursica's purpose, philosophy, and core components
- **[Designer Guide](docs/DESIGNER-GUIDE.md)** - Complete guide for Figma designers using the plugin and git workflow
- **[Developer Guide](docs/DEVELOPER-GUIDE.md)** - Configuration and usage guide for developers integrating the UI kit
- **[Icons Guide](docs/ICONS-GUIDE.md)** - Managing icon exports from Figma to your codebase

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10.9.0
- GitHub CLI - Required for pull request creation

### Installation

1. Clone the repository:

```sh
git clone https://github.com/borderux/recursica.git
cd recursica
```

2. Install dependencies:

```sh
npm install
```

3. Install and authenticate GitHub CLI:

```sh
# macOS
brew install gh

# Or download from https://cli.github.com/
gh auth login
```

4. Build all packages:

```sh
npm run build
```

## Available Scripts

- `npm run build` - Build all packages and applications
- `npm run dev` - Start development mode for all packages and applications
- `npm run recursica` - Run the Recursica CLI tool
- `npm run lint` - Run ESLint across all packages
- `npm run format` - Format all files using Prettier
- `npm run check-types` - Run TypeScript type checking
- `npm run test` - Run tests across all packages
- `npm run version` - Update versions using Changesets
- `npm run release` - Publish packages to npm (requires proper authentication)

## Project Structure

### Apps

- `apps/figma-plugin` - Figma plugin for exporting design tokens and assets from Figma to your codebase
- `apps/recursica-internal-tool` - Internal Figma plugin for team operations, theme management, and page operations
- `apps/recursica-storybook` - Storybook application for showcasing design tokens and components in a Figma-oriented format
- `apps/ai-form-test` - Testing application for AI-driven form generation

### Packages

- `packages/common` - Shared utilities and helper functions used across the monorepo
- `packages/eslint-config` - Shared ESLint configurations for consistent code style
- `packages/mantine-adapter` - Adapter for integrating Recursica with Mantine UI framework
- `packages/schemas` - JSON schemas and TypeScript type definitions for Recursica's configuration
- `packages/typescript-config` - Shared TypeScript configurations
- `packages/ui-kit-mantine` - Core UI component library built with Mantine

## Contributing

We welcome contributions of all kinds! Whether you want to report bugs, suggest enhancements, or submit code changes, your help is appreciated. Please check our [Contributing Guidelines](CONTRIBUTING.md) for:

- How to submit bug reports and feature requests
- The pull request process
- Using changesets for version management
- Code of conduct

For detailed information about our AI-powered pull request workflow, see [Contributing Guidelines](CONTRIBUTING.md).

## Additional Documentation

- [Release Process](RELEASES.md)
- [Turborepo Setup](TURBO.md)

## Development Tools

This project uses several development tools to ensure code quality and consistency:

- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io) - Code formatting
- [Turborepo](https://turborepo.com/) - Monorepo build system
- [Changesets](https://github.com/changesets/changesets) - Version management and publishing

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
